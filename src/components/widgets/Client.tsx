import React from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Label } from '@/components/ui/label.tsx';
import SearchAutoComplete from '@/components/widgets/SearchAutoComplete.tsx';
import { DaySelect } from "@/components/widgets/DaySelect.tsx";
import { fetchData } from "@/lib/fetch.ts";
import { useToast } from "@/components/hooks/use-toast.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input.tsx";
import { SearchIcon } from "lucide-react";
import timeRangesData from '@/lib/time.json';
import {cn} from "@/lib/utils.ts";

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
  const [searchResults, setSearchResults] = React.useState<Schedule[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedProdi, setSelectedProdi] = React.useState('');
  const [selectedDay, setSelectedDay] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const { toast } = useToast()

  React.useEffect(() => {
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

  const filteredResults = React.useMemo(() => {
    if (!searchResults) return null;
    return searchResults.filter(result =>
      Object.values(result).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchResults, searchTerm]);

  const ResultCard: React.FC<{ result: Schedule }> = ({ result }) => {
    const calculateTimeRange = (jam: string) => {
      const jamParts = jam.split(',').map(part => parseInt(part.trim()));
      const startIndex = Math.min(...jamParts) - 1;
      const endIndex = Math.max(...jamParts) - 1;

      if (startIndex < 0 || endIndex >= timeRangesData.timeRanges.length) {
        return "Time not available";
      }

      const startTime = timeRangesData.timeRanges[startIndex].split('-')[0];
      const endTime = timeRangesData.timeRanges[endIndex].split('-')[1];

      return `${startTime} - ${endTime}`;
    };

    const timeRange = calculateTimeRange(result.jam);

    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg">{result.matkul}</h3>
              <p className="text-sm text-gray-500">{result.kode}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{result.hari}</p>
              <Popover>
                <PopoverTrigger asChild>
                  <a className="link">Jam<span className="px-2 ml-2 font-semibold bg-gray-600 text-gray-100 dark:bg-gray-100 dark:text-gray-700">{result.jam}</span></a>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                <p>{timeRange}</p>
                </PopoverContent>
              </Popover>
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
  };

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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Search Results</h2>
            <div className="w-2/5 md:w-1/4 flex justify-start relative items-center">
              <SearchIcon className="absolute ml-3" width={20} height={20} />
              <Input
                type="text"
                placeholder="Filter..."
                className={cn(
                  "px-3 py-1 text-sm bg-background shadow-sm transition-colors",
                  "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                  "placeholder:text-muted-foreground focus-visible:outline-none pl-10",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            filteredResults?.map((result, index) => (
              <ResultCard key={index} result={result} />
            ))
          )}
          {filteredResults && filteredResults.length === 0 && (
            <p className="text-center text-gray-500">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Client;
