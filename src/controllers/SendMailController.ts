import { Request, response, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyRepository } from "../repositories/SurveyRepository";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';

class SendMailController {
    async execute(req: Request, res: Response) {
        const { email, survey_id } = req.body;

        const usersRepository = getCustomRepository(UserRepository);
        const surveysRepository = getCustomRepository(SurveyRepository);
        const surveyUserRepository = getCustomRepository(SurveyUserRepository);

        const user = await usersRepository.findOne({email});

        if (!user) {
            return res.status(400).json({
                error: "User does not exists",
            });
        }

        const survey = await surveysRepository.findOne({id: survey_id});
        if (!survey) {
            return res.status(400).json({
                error: "Survey does not exists",
            });
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: user.id,
            link: process.env.URL_MAIL
        }

        const surveyUserExist = await surveyUserRepository.findOne({
            where: [
                {
                    user_id: user.id
                },
                {
                    value: null
                },
                {
                    survey_id: survey.id
                }
            ],
            relations: ["user", "survey"],
        });
        if (surveyUserExist) {
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return res.json(surveyUserExist);
        }

        const surveyUser = surveyUserRepository.create({
            user_id: user.id,
            survey_id
        });

        await surveyUserRepository.save(surveyUser);

        await SendMailService.execute(email, survey.title, variables, npsPath);

        return res.json(surveyUser);
    }
}

export { SendMailController }