import {
    Button
}

from "@/components/ui/button";

import {
    ChevronLeft,
    ChevronRight,
    ChevronDown
}

from "lucide-react";

interface UpcomingHeaderProps {
    selectedMonth: string;
    onToday: ()=> void;
    onPrevious: ()=> void;
    onNext: ()=> void;
}

export function UpcomingHeader( {
        selectedMonth,
        onToday,
        onPrevious,
        onNext
    }

    : UpcomingHeaderProps) {
    return (<div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4"> <div className="flex items-center justify-between"> <h1 className="text-2xl font-bold text-foreground">Upcoming</h1> <div className="flex items-center gap-2"> <Button variant="ghost"
        size="sm"
        className="text-sm text-muted-foreground hover:text-foreground"

        > {
            selectedMonth
        }

        <ChevronDown className="ml-1 h-4 w-4"/> </Button> <div className="flex items-center gap-1 ml-4"> <Button variant="ghost"
        size="icon"

        onClick= {
            onPrevious
        }

        className="h-8 w-8"
        > <ChevronLeft className="h-4 w-4"/> </Button> <Button variant="ghost"
        size="sm"

        onClick= {
            onToday
        }

        className="h-8 px-3 text-sm"
        > Today </Button> <Button variant="ghost"
        size="icon"

        onClick= {
            onNext
        }

        className="h-8 w-8"
        > <ChevronRight className="h-4 w-4"/> </Button> </div> </div> </div> </div>);
}