import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function Profile() {

    return (
        <Card className="w-50">
            <CardContent>
                <Avatar>
                    <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXqCzc5A0i6-2DBkGnT8d-_A2YJwmLfsF_Ww&s"/>
                    <AvatarFallback>ST</AvatarFallback>
                </Avatar>
            </CardContent>
        </Card>
    );
}
