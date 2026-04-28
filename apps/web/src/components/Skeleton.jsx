import clsx from 'clsx';

function Skeleton({ className, ...rest }) {
  return <div className={clsx('skeleton', className)} {...rest} />;
}

Skeleton.Page = function SkeletonPage() {
  return (
    <div className="mx-auto max-w-screen-md px-4 py-6 space-y-4">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
};

export default Skeleton;
