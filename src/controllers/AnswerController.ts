import { Request, response, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";

class AnswerController {
    async execute(req: Request, res: Response) {
        const { value } = req.params;
        const { id } = req.query;

        const surveyUserRepository = getCustomRepository(SurveyUserRepository);

        const surveyUser = await surveyUserRepository.findOne({
            id: String(id)
          })
      ;

        if (!surveyUser) {
            throw new AppError("Survey User does not exists!");
        }

        surveyUser.value = parseInt(value);

        await surveyUserRepository.save(surveyUser);

        return res.json(surveyUser);
    }
}

export { AnswerController }