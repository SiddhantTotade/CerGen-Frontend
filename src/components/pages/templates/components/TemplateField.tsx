import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/common/SearchableSelect";

export default function TemplateFields({ register, errors, events }: any) {
  return (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Template Name"
        {...register("template_name")}
        className="p-[19px]"
      />
      {errors.template_name && (
        <p className="text-red-500 pl-1 text-[12px]">
          {errors.template_name.message}
        </p>
      )}
      <SearchableSelect
        items={events}
        label="Select Event"
      />
    </div>
  );
}
