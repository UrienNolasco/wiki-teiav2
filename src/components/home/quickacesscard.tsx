import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface QuickAcessCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  content: string;
  path: string;
  buttonText: string;
}

export function QuickAcessCard({
  icon: Icon,
  title,
  subtitle,
  content,
  path,
  buttonText,
}: QuickAcessCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col h-full">
      <CardHeader className="pb-2">
        <Icon className="h-8 w-8 text-purple-500 mb-2" />
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm">{content}</p>
      </CardContent>
      <CardFooter className="pt-0 mt-auto">
        <Button asChild variant="outline" className="w-full">
          <Link href={path}>
            {buttonText}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
