import { BrandMark } from "./brand-mark";

export type ReceiptShopDetails = {
  shopName?: string;
  doctorName?: string;
  address?: string;
  mobile?: string;
  email?: string;
  registrationNumber?: string;
};

/** Shared shop letterhead for visit, spectacle and payment receipts, including print. */
export function ReceiptHeader({ shop }: { shop: ReceiptShopDetails }) {
  const name = shop.shopName?.trim() || "Chirag Eye Care & Optics";
  return (
    <header className="receipt-header">
      <div className="receipt-brand">
        <span className="receipt-logo" role="img" aria-label={`${name} logo`}>
          <BrandMark />
        </span>
        <div>
          <h1>{name}</h1>
          {shop.doctorName && <p className="receipt-doctor">{shop.doctorName}</p>}
          {shop.registrationNumber && <p>Registration: {shop.registrationNumber}</p>}
        </div>
      </div>
      <div className="receipt-contact">
        {shop.address && <p>{shop.address}</p>}
        {shop.mobile && <p>Phone: {shop.mobile}</p>}
        {shop.email && <p>Email: {shop.email}</p>}
      </div>
    </header>
  );
}
