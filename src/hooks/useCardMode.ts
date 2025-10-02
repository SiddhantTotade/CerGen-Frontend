import { useQuery } from "@tanstack/react-query";
import { cardModeKey, getCardMode, setCardMode } from "@/state/cardMode";

import type { Mode } from "@/state/cardMode";

export function useCardMode() {
    const { data: mode = "none" } = useQuery<Mode>({
        queryKey: cardModeKey,
        queryFn: getCardMode,
        initialData: "none",
    });

    return {
        mode,
        setMode: setCardMode,
    };
}
