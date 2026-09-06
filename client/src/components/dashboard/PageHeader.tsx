

interface PageHeaderProps {
  title: string;
  description?: string;
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="mb-1">
      <h2 className="text-[24px] font-bold text-slate-800 tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-[13px] text-slate-600 font-medium mt-0.5">
          {description}
        </p>
      )}
    </div>
  );
};