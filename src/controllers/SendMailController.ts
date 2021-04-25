import { Request, response, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyRepository } from "../repositories/SurveyRepository";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';
import { AppError } from "../errors/AppError";

class SendMailController {
    async execute(req: Request, res: Response) {
        const { email, survey_id } = req.body;

        const usersRepository = getCustomRepository(UserRepository);
        const surveysRepository = getCustomRepository(SurveyRepository);
        const surveyUserRepository = getCustomRepository(SurveyUserRepository);

        const user = await usersRepository.findOne({email});

        if (!user) {
            throw new AppError("User does not exists");
        }

        const survey = await surveysRepository.findOne({id: survey_id});
        if (!survey) {
            throw new AppError("Survey does not exists");
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserExist = await surveyUserRepository.findOne({
            where: {
                user_id: user.id,
                value: null,
                survey_id: survey.id
            },
            relations: ["user", "survey"],
        });
        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if (surveyUserExist) {
            variables.id = surveyUserExist.id;
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return res.json(surveyUserExist);
        }

        const surveyUser = surveyUserRepository.create({
            user_id: user.id,
            survey_id
        });

        await surveyUserRepository.save(surveyUser);

        variables.id = surveyUser.id;

        await SendMailService.execute(email, survey.title, variables, npsPath);

        return res.json(surveyUser);
    }
}

export { SendMailController }