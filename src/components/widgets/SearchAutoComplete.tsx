import { useState, useEffect } from "react";
import { AutoComplete } from "@/components/widgets/AutoComplete.tsx";
import {fetchData} from "@/lib/fetch.ts";

interface StudyProgram {
  faculty: string;
  value: string;
  name: string;
}

interface StudyProgramResponse {
  data: StudyProgram[];
}

export default function SearchAutoComplete() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [studyPrograms, setStudyPrograms] = useState<{ label: string; value: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchStudyPrograms = async () => {
      setIsLoading(true);
      try {
        const response = await fetchData<StudyProgramResponse>('/study-programs');
        if (!response || !Array.isArray(response.data)) {
          throw new Error("Invalid data format received from API");
        }

        const formattedData = response.data.map((item: StudyProgram) => ({
          label: `${item.name} (${item.faculty})`,
          value: item.name.toLowerCase(),
        }));
        setStudyPrograms(formattedData);
      } catch (error) {
        console.error("Error fetching study programs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudyPrograms();
  }, []);

  const filteredPrograms = studyPrograms.filter(program =>
    program.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelectedValueChange = (value: string) => {
    setSelectedValue(value);
    const event = new CustomEvent('studyProgramSelected', { detail: value });
    document.dispatchEvent(event);
  }

  return (
    <AutoComplete
      placeholder="Cari berdasarkan prodi"
      selectedValue={selectedValue}
      onSelectedValueChange={handleSelectedValueChange}
      searchValue={searchValue}
      onSearchValueChange={setSearchValue}
      items={filteredPrograms}
      isLoading={isLoading}
      emptyMessage="Tidak ada data"
    />
  );
}
