import { queryClient } from "@/lib/queryClient";

export const selectedParticipantKey = ["selectedParticipant"] as const

export interface SelectedParticipant {
    id?: string
    event: string
    participants_details: Record<string, string>
}

export function setSelectedParticipant(participant: SelectedParticipant | null) {
    queryClient.setQueryData<SelectedParticipant | null>(selectedParticipantKey, participant)
}

export function getSelectedParticipants(): SelectedParticipant | null {
    return queryClient.getQueryData<SelectedParticipant | null>(selectedParticipantKey) ?? null
}