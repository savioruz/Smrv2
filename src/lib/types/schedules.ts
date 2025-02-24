import type { Response } from './api';

export interface Schedule {
	class_code: string;
	course_code: string;
	course_name: string;
	day: string;
	end_time: string;
	lecturer?: string | null;
	room_number: string;
	semester: string;
	credits: number;
	start_time: string;
	study_program: string;
}

export type SchedulesResponse = Response<Schedule[]>;

export type SyncSchedulesResponse = Response<{
	message: string;
}>;
