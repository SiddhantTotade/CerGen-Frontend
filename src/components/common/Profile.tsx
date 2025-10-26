import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";

export function Profile() {
    const navigate = useNavigate()

    return (
        <Card className="w-60">
            <CardContent>
                <Avatar>
                    <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXqCzc5A0i6-2DBkGnT8d-_A2YJwmLfsF_Ww&s" />
                    <AvatarFallback>ST</AvatarFallback>
                </Avatar>
            </CardContent>
            <Button onClick={() => navigate({ "to": "/app/templates" })} className="cursor-pointer">Html Templates</Button>
        </Card>
    );
}
