'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, Search, Euro, MapPin, Bell, User, Tag, X, Filter, ChevronDown } from 'lucide-react'
import Image from 'next/image'

    // image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SCHOENER_WOHNEN_Kunstdrucke-Srwn6toJEK7SBT3J7piFPMLxdtk67m.jpg",
const initialApartments = [
  {
    id: 1,
    title: "Modernes Wohnzimmer mit Kunstgalerie",
    price: 1500,
    location: "Stadtmitte",
    type: "Luxus",
    isNew: true,
    image: "https://drive.google.com/file/d/1U8Vyz0dvbLz-NFcq2ntqItXEUn0tKsDE/view?usp=drive_link",
    tags: ["Große Fenster", "Kunstgalerie", "Graues Sofa", "Holzmöbel", "Winterblick"]
  },
  { 
    id: 2, 
    title: "Stilvolles Schlafzimmer im Industrial-Chic", 
    price: 1300, 
    location: "Altstadt", 
    type: "Regulär", 
    isNew: true, 
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/modern-wohnen-teaser-6OkpXT8Isi5BoFuLPjMpVtv9iC6o3G.jpg", 
    tags: ["Ziegelwand", "Stehlampe", "Metallregal", "Botanische Drucke", "Grau-Weiß-Farbschema"]
  },
  { 
    id: 3, 
    title: "Helles Wohnzimmer mit pastellblauen Wänden", 
    price: 1100, 
    location: "Westend", 
    type: "Regulär", 
    isNew: false, 
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wohnstil-fritz-hansen-jpg--72140--hamhBu3MB6DSvpK5PKsbmwZwCLczOR.jpg", 
    tags: ["Pastellblaue Wände", "Weißes Sofa", "Holzboden", "Vintage-Elemente"]
  },
  { 
    id: 4, 
    title: "Modernes Esszimmer mit blauer Akzentwand", 
    price: 1200, 
    location: "Nordend", 
    type: "Regulär", 
    isNew: false, 
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/schoener-wohnen-kollektion-esszimmer-jpg--71457--Ufohj0sxEE9w7HavXuiAMcdDILM7Zo.jpg", 
    tags: ["Blaue Akzentwand", "Holzesstisch", "Beleuchtete Regale", "Moderne Einrichtung"]
  },
]

const allTags = Array.from(new Set(initialApartments.flatMap(apt => apt.tags)))

export function WohnraumMobileApp() {
  const [apartments, setApartments] = useState(initialApartments)
  const [searchTerm, setSearchTerm] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [tagFilters, setTagFilters] = useState<string[]>([])
  const [notifications, setNotifications] = useState([
    "Neue Wohnung in Ihrer Wunschgegend verfügbar!",
    "Ihr Antrag für die Sozialwohnung wurde genehmigt."
  ])

  useEffect(() => {
    const filteredApartments = initialApartments.filter(apartment => {
      const matchesSearch = apartment.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPrice = priceFilter === "all" || 
        (priceFilter === "low" && apartment.price < 1200) ||
        (priceFilter === "medium" && apartment.price >= 1200 && apartment.price <= 1400) ||
        (priceFilter === "high" && apartment.price > 1400)
      const matchesLocation = locationFilter === "all" || apartment.location.toLowerCase() === locationFilter.toLowerCase()
      const matchesTags = tagFilters.length === 0 || tagFilters.every(tag => apartment.tags.includes(tag))
      return matchesSearch && matchesPrice && matchesLocation && matchesTags
    })
    setApartments(filteredApartments)
  }, [searchTerm, priceFilter, locationFilter, tagFilters])

  const handleTagFilter = (tag: string) => {
    setTagFilters(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 bg-blue-100 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">Wohnraumvermittlung für Kommune</h1>
        <div className="flex items-center space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Bell className="h-6 w-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Benachrichtigungen</SheetTitle>
              </SheetHeader>
              {notifications.length > 0 ? (
                <ul className="space-y-2 mt-4">
                  {notifications.map((notification, index) => (
                    <li key={index} className="bg-gray-100 p-2 rounded text-gray-800">
                      {notification}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 mt-4">Keine neuen Benachrichtigungen.</p>
              )}
            </SheetContent>
          </Sheet>
          <Button variant="ghost" size="icon" className="text-gray-600">
            <User className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Input 
            className="flex-grow bg-white border-gray-300" 
            placeholder="Suche nach Wohnungen..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Preis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Preise</SelectItem>
                    <SelectItem value="low">Unter 1200€</SelectItem>
                    <SelectItem value="medium">1200€ - 1400€</SelectItem>
                    <SelectItem value="high">Über 1400€</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Stadtteil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Stadtteile</SelectItem>
                    <SelectItem value="Stadtmitte">Stadtmitte</SelectItem>
                    <SelectItem value="Altstadt">Altstadt</SelectItem>
                    <SelectItem value="Westend">Westend</SelectItem>
                    <SelectItem value="Nordend">Nordend</SelectItem>
                    <SelectItem value="Ostend">Ostend</SelectItem>
                  </SelectContent>
                </Select>
                <div>
                  <h3 className="font-semibold mb-2">Merkmale</h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={tagFilters.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleTagFilter(tag)}
                      >
                        {tag}
                        {tagFilters.includes(tag) && <X className="ml-1 h-3 w-3" />}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Button onClick={() => {setPriceFilter("all"); setLocationFilter("all"); setTagFilters([]);}} className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                Filter zurücksetzen
              </Button>
            </SheetContent>
          </Sheet>
        </div>

        {(priceFilter !== "all" || locationFilter !== "all" || tagFilters.length > 0) && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {priceFilter !== "all" && (
              <Badge variant="secondary" className="whitespace-nowrap bg-blue-100 text-blue-800">
                Preis: {priceFilter === "low" ? "< 1200€" : priceFilter === "medium" ? "1200€ - 1400€" : "> 1400€"}
                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setPriceFilter("all")} />
              </Badge>
            )}
            {locationFilter !== "all" && (
              <Badge variant="secondary" className="whitespace-nowrap bg-blue-100 text-blue-800">
                {locationFilter}
                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setLocationFilter("all")} />
              </Badge>
            )}
            {tagFilters.map(tag => (
              <Badge key={tag} variant="secondary" className="whitespace-nowrap bg-blue-100 text-blue-800">
                {tag}
                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => handleTagFilter(tag)} />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {apartments.map((apartment) => (
          <Card key={apartment.id} className="bg-white border border-gray-200 overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={apartment.image}
                alt={apartment.title}
                layout="fill"
                objectFit="cover"
                width={1200}
                height={1200}
              />
              {apartment.isNew && (
                <Badge variant="secondary" className="absolute top-2 right-2 bg-blue-100 text-blue-800">
                  Neu
                </Badge>
              )}
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-medium text-gray-900">
                  {apartment.title}
                </CardTitle>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {apartment.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                <span className="flex items-center">
                  <Euro className="mr-1 h-4 w-4" />
                  {apartment.price}€ / Monat
                </span>
                <span className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {apartment.location}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-wrap gap-1">
                {apartment.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-800">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}

        {apartments.length === 0 && (
          <p className="text-center text-gray-600 mt-8 bg-gray-100 p-4 rounded-lg">
            Keine Wohnungen gefunden. Bitte ändern Sie Ihre Suchkriterien.
          </p>
        )}
      </div>
    </div>
  )
}