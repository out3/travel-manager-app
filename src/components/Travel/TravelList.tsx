// React
import {useState} from 'react';
// Types
import {Travel} from '@/types.ts';
// UI
import {Button} from "@/components/ui/button.tsx"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,} from "@/components/ui/command.tsx"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover.tsx"
// Icons
import {CaretSortIcon, CheckIcon} from "@radix-ui/react-icons";
import {cn} from '@/lib/utils.ts';


// Props interface
type TravelAddEditFormProps = {
    travelsList: Travel[]
    currentTravel: Travel | undefined
    updateCurrentTravel: (travel: Travel) => void
}


function TravelList({travelsList, currentTravel, updateCurrentTravel}: TravelAddEditFormProps) {
    // const [currentTravel, setCurrentTravel] = useState<Travel | undefined>();
    const [openTravelListDropdown, setOpenTravelListDropdown] = useState<boolean>(false);
    // Variable used to avoid travel searching by its rowid
    const [searchInput, setSearchInput] = useState<string>("");

    return (
        <>
            <Popover open={openTravelListDropdown} onOpenChange={setOpenTravelListDropdown}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openTravelListDropdown}
                        className="w-full h-12 justify-between"
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
                            {travelsList.map((travel) => (
                                <CommandItem
                                    key={travel.rowid}
                                    // Rowid is used so two travel on the same country doesn't react as one
                                    value={travel.country.name + travel.rowid}
                                    // Avoid searching by rowid by deleting numbers in the search input
                                    onSelect={() => {
                                        updateCurrentTravel(travel)
                                        setOpenTravelListDropdown(false)
                                    }}
                                >
                                    {travel.country.name}
                                    <pre className="text-gray-500">
                                        {travel.start_date ? " | " + travel.start_date.toLocaleDateString() : ""}
                                        {travel.end_date ? " ~ " + travel.end_date.toLocaleDateString() : ""}
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

export default TravelList
