export function ProfileFields({
  fieldName,
  fieldDetails,
}: {
  fieldName: string;
  fieldDetails: string;
}) {
  return (
    <div className="flex items-center mb-5 font-main">
      <strong className="mr-2 text-lg font-main">{fieldName}:</strong>{" "}
      {fieldDetails}
    </div>
  );
}