import { useQuery } from "@tanstack/react-query";
import { setSelectedParticipant, getSelectedParticipants, selectedParticipantKey, type SelectedParticipant } from "@/state/selectedParticipant";

export function useSelectedParticipant() {
    const { data: selectedParticipant = null } = useQuery<SelectedParticipant | null>({
        queryKey: selectedParticipantKey,
        queryFn: getSelectedParticipants,
        initialData: null
    })

    return {
        selectedParticipant,
        setSelectedParticipant
    }
}