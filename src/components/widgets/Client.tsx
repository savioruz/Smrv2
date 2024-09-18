import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx"
import { Label } from '@/components/ui/label.tsx';
import SearchAutoComplete from '@/components/widgets/SearchAutoComplete.tsx';
import { DaySelect } from "@/components/widgets/DaySelect.tsx";
import { fetchData } from "@/lib/fetch.ts";
import { useToast } from "@/components/hooks/use-toast.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";

interface Schedule {
  dosen: string;
  hari: string;
  jam: string;
  kelas: string;
  kode: string;
  matkul: string;
  ruang: string;
  semester: string;
  sks: string;
}

interface ScheduleResponse {
  data: Schedule[];
}

const Client = () => {
  const [searchResults, setSearchResults] = useState<Schedule[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProdi, setSelectedProdi] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const { toast } = useToast()

  useEffect(() => {
    const handleStudyProgramSelected = (event: CustomEvent<string>) => {
      setSelectedProdi(event.detail);
    };

    const handleDaySelected = (event: CustomEvent<string>) => {
      setSelectedDay(event.detail);
    };

    document.addEventListener('studyProgramSelected', handleStudyProgramSelected as EventListener);
    document.addEventListener('daySelected', handleDaySelected as EventListener);

    return () => {
      document.removeEventListener('studyProgramSelected', handleStudyProgramSelected as EventListener);
      document.removeEventListener('daySelected', handleDaySelected as EventListener);
    };
  }, []);

  const handleSearch = async (): Promise<void> => {
    if (!selectedProdi || !selectedDay) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please select a study program and a day."
      })
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchData<ScheduleResponse>(`/schedule?study_programs=${selectedProdi}&day=${selectedDay}`);
      setSearchResults(response.data);
      toast({
        title: "Yay!",
        description: "Data fetched successfully."
      })
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request."
      })
    } finally {
      setIsLoading(false);
    }
  };

  const ResultCard: React.FC<{ result: Schedule }> = ({ result }) => (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-lg">{result.matkul}</h3>
            <p className="text-sm text-gray-500">{result.kode}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{result.hari}</p>
            <p>Jam<span className="ml-2 font-semibold">{result.jam}</span></p>
            <p className="text-sm text-gray-500">Ruang {result.ruang}</p>
          </div>
          <div className="col-span-2">
            <p><span className="font-semibold">Dosen:</span> {result.dosen}</p>
            <p><span className="font-semibold">Kelas:</span> {result.kelas}</p>
            <p><span className="font-semibold">SKS:</span> {result.sks}</p>
            <p><span className="font-semibold">Semester:</span> {result.semester}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SkeletonCard: React.FC = () => (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="text-right">
            <Skeleton className="h-6 w-1/2 mb-2 ml-auto" />
            <Skeleton className="h-4 w-1/3 ml-auto" />
          </div>
          <div className="col-span-2 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // @ts-ignore
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl min-h-[85vh] flex flex-col items-center justify-center">
      <Card className="w-full max-w-[48rem]">
        <CardHeader>
          <CardTitle className="text-3xl md:text-5xl font-bold text-center md:mb-8 text-black-50">
            Smrv2
            <span className="text-sm md:text-lg block mt-2 font-normal text-gray-400">
              Sebuah website untuk mencari jadwal kuliah, info ruangan, dll berdasarkan simeru.
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="prodi" className="ml-1 block text-sm font-medium dark:text-gray-400">
                Prodi
              </Label>
              <SearchAutoComplete />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="day" className="ml-1 block text-sm font-medium dark:text-gray-400">
                Hari
              </Label>
              <DaySelect />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {(isLoading || searchResults) && (
        <div className="w-full max-w-[48rem] mt-8 space-y-4">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            searchResults?.map((result: Schedule, index: React.Key | null | undefined) => (
              <ResultCard key={index} result={result} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Client;
