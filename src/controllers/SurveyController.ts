import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveyRepository } from "../repositories/SurveyRepository"

class SurveyController {
    async create(req: Request, res: Response) {
        const { title, description } = req.body;
        const surveyRepository = getCustomRepository(SurveyRepository)

        const survey = surveyRepository.create({
            title,
            description
        });

        const surveyAlreadyExists = await surveyRepository.findOne({title});

        if (surveyAlreadyExists) {
            throw new AppError("Survey with this title already exists.");
        }

        await surveyRepository.save(survey);

        return res.status(201).json(survey);
    }

    async show(req: Request, res: Response) {
        const surveyRepository = getCustomRepository(SurveyRepository);

        const all = await surveyRepository.find();

        return res.status(201).json(all);
    }
}

export { SurveyController }