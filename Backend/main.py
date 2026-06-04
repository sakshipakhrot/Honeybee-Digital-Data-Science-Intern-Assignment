from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional

import schemas
from database import get_db

app = FastAPI(title="Business Directory API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API 1: Bulk Insert ---
@app.post("/api/listings/bulk-insert", status_code=status.HTTP_201_CREATED)
def bulk_insert_listings(listings: List[schemas.ListingCreate], db: Session = Depends(get_db)):
    if not listings:
        raise HTTPException(status_code=400, detail="Listing list cannot be empty")
    
    query = text("""
        INSERT INTO listing_table (business_name, category, city, address, phone, source)
        VALUES (:business_name, :category, :city, :address, :phone, :source)
    """)
    listings_data = [listing.model_dump() for listing in listings]
    
    try:
        db.execute(query, listings_data)
        db.commit()
        return {"message": f"Successfully inserted {len(listings_data)} business listings."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database insertion failed: {str(e)}")


# --- API 2: Fetch Dashboard Metrics (Updated for Source Filter) ---
@app.get("/api/dashboard/metrics")
def get_dashboard_metrics(city: Optional[str] = None, category: Optional[str] = None, source: Optional[str] = None, db: Session = Depends(get_db)):
    try:
        where_clause = "1=1"
        params = {}
        if city:
            where_clause += " AND city = :city"
            params['city'] = city
        if category:
            where_clause += " AND category = :category"
            params['category'] = category
        if source:
            where_clause += " AND source = :source"
            params['source'] = source

        city_query = db.execute(text(f"SELECT COALESCE(city, 'Unknown') as label, COUNT(*) as count FROM listing_table WHERE {where_clause} GROUP BY city ORDER BY count DESC"), params).fetchall()
        category_query = db.execute(text(f"SELECT COALESCE(category, 'Unknown') as label, COUNT(*) as count FROM listing_table WHERE {where_clause} GROUP BY category ORDER BY count DESC"), params).fetchall()
        source_query = db.execute(text(f"SELECT COALESCE(source, 'Unknown') as label, COUNT(*) as count FROM listing_table WHERE {where_clause} GROUP BY source ORDER BY count DESC"), params).fetchall()
        
        return {
            "city_wise": [{"label": row.label, "count": row.count} for row in city_query],
            "category_wise": [{"label": row.label, "count": row.count} for row in category_query],
            "source_wise": [{"label": row.label, "count": row.count} for row in source_query]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- API 3: Fetch Raw Data for the Table (Updated for Source Filter) ---
@app.get("/api/listings")
def get_listings(city: Optional[str] = None, category: Optional[str] = None, source: Optional[str] = None, limit: int = 10, db: Session = Depends(get_db)):
    try:
        where_clause = "1=1"
        params = {}
        if city:
            where_clause += " AND city = :city"
            params['city'] = city
        if category:
            where_clause += " AND category = :category"
            params['category'] = category
        if source:
            where_clause += " AND source = :source"
            params['source'] = source

        query = text(f"SELECT * FROM listing_table WHERE {where_clause} ORDER BY id DESC LIMIT {limit}")
        results = db.execute(query, params).mappings().fetchall()
        
        return [{
            "id": r.get("id", 0),
            "business_name": r.get("business_name") or r.get("Business Name", "N/A"),
            "category": r.get("category") or r.get("Category", "N/A"),
            "city": r.get("city") or r.get("City", "N/A"),
            "phone": r.get("phone") or r.get("Phone Number", "N/A"),
            "source": r.get("source") or r.get("Source", "N/A")
        } for r in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
