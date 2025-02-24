import type { Response } from './api';

export interface StudyProgram {
	id: number;
	name: string;
}

export type StudyProgramsResponse = Response<StudyProgram[]>;
