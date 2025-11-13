import { FormCard } from "@/components/common/FormCard";
import { useSelectedParticipant } from "@/hooks/useSelectedParticipant";

export function SelectedParticipantDetails() {
    const { selectedParticipant } = useSelectedParticipant();

    if (!selectedParticipant) return <p>Hello</p>;

    return (
        <FormCard>
            <div>
                <ul className="mt-2 space-y-1">
                    {Object.entries(selectedParticipant.participant_details).map(([key, value]) => (
                        <li key={key} className="flex justify-between">
                            <span className="font-medium">{key}</span>
                            <span>{value}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </FormCard>
    );
}
