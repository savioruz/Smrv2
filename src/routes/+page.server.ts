import type { PageServerLoad } from './$types';
import type { StudyProgramsResponse, StudyProgram } from '$lib/types/study-programs';

export const load: PageServerLoad = async () => {
	try {
		const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/study/programs`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const studyProgramResponse: StudyProgramsResponse = await response.json();

		return {
			studyPrograms:
				studyProgramResponse?.data?.map((program: StudyProgram) => ({
					label: program.name,
					value: program.name
				})) || []
		};
	} catch (error) {
		console.error('Error fetching study programs:', error);
		return {
			studyPrograms: []
		};
	}
};
