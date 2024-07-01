import type { Question } from "../Model"
export interface Repositpry{
    getQuestion(level:number):Question;
}
