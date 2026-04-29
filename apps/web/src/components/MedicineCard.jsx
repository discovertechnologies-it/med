import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, ShieldAlert, Tag, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import Badge from './Badge';
import ProductImage from './ProductImage';
import WishlistButton from './WishlistButton';
import { formatPrice, discountPercent } from '@/utils/formatPrice';
import { useCartStore } from '@/store/useCartStore';
import { springs } from '@/motion/transitions';

export default function MedicineCard({ medicine, className }) {
  const addItem = useCartStore((s) => s.addItem);
  const discount = discountPercent(medicine.mrp, medicine.sellingPrice);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(
      {
        id: medicine.id,
        name: medicine.brand,
        price: medicine.sellingPrice,
        requiresPrescription: medicine.requiresPrescription,
      },
      1
    );
    toast.success(`Added ${medicine.brand} to cart`);
  };

  return (
    <m.div whileHover={{ y: -3 }} transition={springs.soft} className={clsx('h-full', className)}>
      <Link
        to={`/medicine/${medicine.id}`}
        className={clsx(
          'group flex flex-col h-full bg-bg-surface border border-border-subtle rounded-xl overflow-hidden',
          'shadow-card hover:shadow-pop hover:border-border-strong transition'
        )}
      >
        {/* Image area — uses shared ProductImage so gallery and card stay consistent */}
        <div className="relative">
          <ProductImage medicine={medicine} variant="front" size="sm" withGuides={false} rounded="" />

          {/* Top-left: stacked Rx + Generic */}
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
            {medicine.requiresPrescription && (
              <Badge variant="warning" icon={<ShieldAlert size={12} />}>
                Rx
              </Badge>
            )}
            {medicine.isGeneric && (
              <Badge variant="primary" icon={<Sparkles size={12} />}>
                Generic
              </Badge>
            )}
          </div>

          {/* Top-right: discount + wishlist */}
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5">
            {discount > 0 && (
              <Badge variant="accent" icon={<Tag size={12} />}>
                {discount}% off
              </Badge>
            )}
            <WishlistButton
              medicineId={medicine.id}
              medicineName={medicine.brand}
              size="sm"
              variant="overlay"
            />
          </div>
        </div>

        {/* Content area — flex-1 so price+add stick to bottom */}
        <div className="flex-1 flex flex-col p-3 md:p-4">
          <h3 className="text-body font-semibold text-text-primary line-clamp-1">
            {medicine.brand}
          </h3>
          <p className="mt-0.5 text-caption text-text-secondary line-clamp-1">{medicine.salt}</p>
          <p className="mt-0.5 text-caption text-text-tertiary line-clamp-1">
            {medicine.manufacturer}
          </p>

          <div className="mt-auto pt-3 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5 tabular">
                <span className="text-body-lg font-semibold text-text-primary">
                  {formatPrice(medicine.sellingPrice)}
                </span>
                {discount > 0 && (
                  <span className="text-caption text-text-tertiary line-through">
                    {formatPrice(medicine.mrp)}
                  </span>
                )}
              </div>
              <p className="text-caption text-text-tertiary line-clamp-1">{medicine.packSize}</p>
            </div>

            <m.button
              type="button"
              onClick={handleAdd}
              whileTap={{ scale: 0.92 }}
              transition={springs.soft}
              aria-label={`Add ${medicine.brand} to cart`}
              className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              <Plus size={18} />
            </m.button>
          </div>
        </div>
      </Link>
    </m.div>
  );
}
