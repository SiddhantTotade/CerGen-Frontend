import { Card } from "@/components/ui/card";

export function AppCard({ children }: { children: React.ReactNode }) {
    return (
        <div id="custom_card" className="fixed inset-0 flex items-center justify-center bg-gray-100">
            {/* <Card className="w-full max-w-md p-6 rounded-2xl shadow-xl"> */}
                {children}
            {/* </Card> */}
        </div>
    );
}
