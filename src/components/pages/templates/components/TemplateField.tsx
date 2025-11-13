import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/common/SearchableSelect";

export default function TemplateFields({ register, errors, events }: any) {
  return (
    <div className="flex gap-2">
      <div className="w-full">
        <Input
          type="text"
          placeholder="Template Name"
          {...register("template_name")}
          className="p-[19px]"
        />
        {errors.template_name && (
          <p className="text-red-500 pl-1 text-[10px]">
            {errors.template_name.message}
          </p>
        )}
      </div>
      <SearchableSelect items={events} label="Select Event" />
    </div>
  );
}
