import './TravelList.css'

// When using the Tauri API npm package:
import {invoke} from '@tauri-apps/api/tauri'

// Interfaces
import {Travel} from '@/interfaces/Travel.ts';

// React hooks
import {useEffect, useState} from 'react';

// Components
import {Button} from "@/components/ui/button"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {CaretSortIcon, CheckIcon} from "@radix-ui/react-icons";
import {cn} from '@/lib/utils';

// Props interface
// type TravelAddEditFormProps = {
//     setCurrentTravelHandler: (travelId: number) => void
//     currentTravel: Travel | undefined
// }

// function TravelList({setCurrentTravelHandler, currentTravel}: TravelAddEditFormProps) {
function TravelList() {
    // List of every travels
    const [travels, setTravels] = useState<Travel[]>([]);
    const [currentTravel, setCurrentTravel] = useState<Travel | undefined>();
    const [openTravelListDropdown, setOpenTravelListDropdown] = useState<Boolean>(false);
    // variable used to avoid travel searching by its rowid
    const [searchInput, setSearchInput] = useState<string>("");
    useEffect(() => {
        fetchTravels();
    }, []);

    function fetchTravels(): void {
        (invoke('get_travels') as Promise<Travel[]>)
            .then((data: Travel[]) => {
                setTravels(data);
            })
            .catch((err: string) => console.error(err));
    }

    function setCurrentTravelHandler(travelId: number): void {
        (invoke('get_travel', {travelId: travelId}) as Promise<Travel>)
            .then((travel) => {
                localStorage.setItem("current-travel", String(travelId))
                setCurrentTravel(travel);
            })
            .catch((err: string) => console.error(err))
    }

    // @ts-ignore
    return (
        <>
            {/*@ts-ignore*/}
            <Popover open={openTravelListDropdown} onOpenChange={setOpenTravelListDropdown}>
                <PopoverTrigger asChild>
                    {/*@ts-ignore*/}
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openTravelListDropdown}
                        className="w-[300px] h-12 justify-between"
                    >
                        {currentTravel?.country.code ? currentTravel.country.name : "Select travel..."}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput
                            placeholder="Search travel..."
                            className="h-9"
                            value={searchInput}
                            onValueChange={(value) => {
                                // Remove numbers from the input
                                setSearchInput(value.replace(/[0-9]/g, ''));
                            }}
                        />
                        <CommandEmpty>No travel found.</CommandEmpty>
                        <CommandGroup>
                            {travels.map((travel) => (
                                <CommandItem
                                    key={travel.rowid}
                                    // Rowid is used so two travel on the same country doesn't react as one
                                    value={travel.country.name + travel.rowid}
                                    // Avoid searching by rowid by deleting numbers in the search input
                                    onSelect={() => {
                                        setCurrentTravelHandler(travel.rowid)
                                        setOpenTravelListDropdown(false)
                                    }}
                                >
                                    {travel.country.name}
                                    <pre className="text-gray-500">
                                        {travel.start_date ? " | " + travel.start_date.toString() : ""}
                                        {travel.end_date ? " ~ " + travel.end_date.toString() : ""}
                                    </pre>
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            currentTravel?.rowid == travel.rowid ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    )
}

export default TravelList;