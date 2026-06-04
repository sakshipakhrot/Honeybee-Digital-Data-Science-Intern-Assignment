from pydantic import BaseModel
from typing import Optional

class ListingCreate(BaseModel):
    business_name: str
    category: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = "Google Maps"

    class Config:
        from_attributes = True