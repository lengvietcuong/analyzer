import { CustomerGroup } from "@/types";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import DownloadGroup from "../download-group";
import EditGroup from "../edit-group";
import DeleteGroup from "../delete-group";

type GroupCardProps = {
  group: CustomerGroup;
  onGroupsChanged: () => void;
  className?: string;
};

export default function GroupCard({
  group,
  onGroupsChanged,
  className,
}: GroupCardProps) {
  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-2">
        <CardTitle>{group.name}</CardTitle>
        <CardDescription>{group.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{group.customer_segments[0].count} customers</p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <DownloadGroup group={group} />
        <EditGroup group={group} onGroupUpdated={onGroupsChanged} />
        <DeleteGroup group={group} onGroupDeleted={onGroupsChanged} />
      </CardFooter>
    </Card>
  );
}
