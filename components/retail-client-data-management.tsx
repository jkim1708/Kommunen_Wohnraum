'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import * as XLSX from 'xlsx'

const initialContacts = [
  { id: 1, name: 'John Smith', company: 'Tech Solutions Ltd', email: 'john@techsolutions.com', phone: '+44 20 1234 5678' },
  { id: 2, name: 'Emma Johnson', company: 'Green Energy PLC', email: 'emma@greenenergy.co.uk', phone: '+44 161 876 5432' },
  { id: 3, name: 'David Brown', company: 'Brown & Co', email: 'david@brownco.com', phone: '+44 121 111 2222' },
  { id: 4, name: 'Sarah Taylor', company: 'Taylor Logistics', email: 'sarah@taylorlogistics.co.uk', phone: '+44 151 333 4444' },
  { id: 5, name: 'Michael Wilson', company: 'Wilson IT Solutions', email: 'michael@wilsonit.com', phone: '+44 1223 555 6666' },
]

const dataCategories = ['name', 'company', 'email', 'phone']

const loadingSteps = [
  "Searching apollo.io",
  "Searching Companies House",
  "Searching Yellow Pages"
]

export function RetailClientDataManagementComponent() {
  const [currentPage, setCurrentPage] = useState<'contacts' | 'search'>('contacts')
  const [contacts, setContacts] = useState(initialContacts)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchProgress, setSearchProgress] = useState(0)
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0)
  const [searchCategory, setSearchCategory] = useState<string>(dataCategories[0])
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedNewContacts, setSelectedNewContacts] = useState<number[]>([])

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => 
      Object.values(contact).some(value => 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [contacts, searchTerm])

  const startSearch = () => {
    setIsSearching(true)
    setSearchProgress(0)
    setCurrentLoadingStep(0)
    setSearchResults([])
  }

  const generateDummySearchResults = (keyword: string, category: string) => {
    const numResults = Math.floor(Math.random() * 6) + 3 // Random number between 3 and 8
    return Array.from({ length: numResults }, (_, i) => ({
      id: i + 1,
      name: `${['John', 'Emma', 'David', 'Sarah', 'Michael'][Math.floor(Math.random() * 5)]} ${keyword}`,
      company: `${keyword} ${['Ltd', 'PLC', 'Inc', 'Co'][Math.floor(Math.random() * 4)]}`,
      email: `${keyword.toLowerCase()}${Math.floor(Math.random() * 1000)}@example.com`,
      phone: `+44 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000000 + 1000000)}`,
    }))
  }

  const toggleNewContactSelection = (id: number) => {
    setSelectedNewContacts(prev => 
      prev.includes(id) ? prev.filter(contactId => contactId !== id) : [...prev, id]
    )
  }

  const importSelectedContacts = () => {
    const newContacts = searchResults.filter(result => selectedNewContacts.includes(result.id))
    setContacts(prev => [...prev, ...newContacts])
    setSelectedNewContacts([])
    setCurrentPage('contacts')
  }

  useEffect(() => {
    if (isSearching) {
      const timer = setInterval(() => {
        setSearchProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer)
            setIsSearching(false)
            const newResults = generateDummySearchResults(searchTerm, searchCategory)
            setSearchResults(newResults)
            return 100
          }
          const newProgress = prev + 1
          if (newProgress % 33 === 0) {
            setCurrentLoadingStep(step => (step + 1) % loadingSteps.length)
          }
          return newProgress
        })
      }, 50)
      return () => clearInterval(timer)
    }
  }, [isSearching, searchTerm, searchCategory])

  return (
    <div className="container mx-auto p-4 bg-white text-black">
      <h1 className="text-3xl font-bold mb-6 text-teal-600">Retail Client Data Management</h1>
      
      <div className="flex justify-between mb-4">
        <Button 
          onClick={() => setCurrentPage('contacts')}
          variant={currentPage === 'contacts' ? 'default' : 'outline'}
        >
          My Contacts
        </Button>
        <Button 
          onClick={() => setCurrentPage('search')}
          variant={currentPage === 'search' ? 'default' : 'outline'}
        >
          Search New Contacts
        </Button>
      </div>

      {currentPage === 'contacts' && (
        <Card className="mb-6 bg-blue-50 border-teal-200">
          <CardHeader>
            <CardTitle className="text-teal-700">My Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex-1">
                <Label htmlFor="contactSearch" className="text-teal-700">Search Contacts</Label>
                <Input
                  id="contactSearch"
                  placeholder="Search your contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-teal-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
            {filteredContacts.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {dataCategories.map(category => (
                        <TableHead key={category} className="whitespace-nowrap text-teal-700">{category}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow key={contact.id} className="hover:bg-teal-50">
                        {dataCategories.map(category => (
                          <TableCell key={`${contact.id}-${category}`} className="whitespace-nowrap">
                            {contact[category as keyof typeof contact]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-4 text-teal-700">
                No contacts found
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentPage === 'search' && (
        <Card className="mb-6 bg-blue-50 border-teal-200">
          <CardHeader>
            <CardTitle className="text-teal-700">Search New Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 mb-4">
              <div>
                <Label htmlFor="searchCategory" className="text-teal-700">Search Category</Label>
                <Select onValueChange={setSearchCategory} defaultValue={searchCategory}>
                  <SelectTrigger id="searchCategory" className="w-full">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="searchTerm" className="text-teal-700">Search Term</Label>
                <Input
                  id="searchTerm"
                  placeholder="Enter search term..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-teal-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
            <Button 
              onClick={startSearch}
              className="bg-teal-500 hover:bg-teal-600 text-white w-full mb-4"
              disabled={isSearching || !searchTerm}
            >
              Start Search
            </Button>
            {isSearching && (
              <div className="mb-4">
                <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-black h-full transition-all duration-200 ease-in-out rounded-full"
                    style={{ width: `${searchProgress}%` }}
                  />
                </div>
                <p className="text-center mt-2 text-teal-700 font-semibold">
                  {loadingSteps[currentLoadingStep]}
                </p>
              </div>
            )}
            {searchResults.length > 0 && (
              <>
                <div className="overflow-x-auto mb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Select</TableHead>
                        {dataCategories.map(category => (
                          <TableHead key={category} className="whitespace-nowrap text-teal-700">{category}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults.map((result) => (
                        <TableRow key={result.id} className="hover:bg-teal-50">
                          <TableCell>
                            <Checkbox
                              checked={selectedNewContacts.includes(result.id)}
                              onCheckedChange={() => toggleNewContactSelection(result.id)}
                            />
                          </TableCell>
                          {dataCategories.map(category => (
                            <TableCell key={`${result.id}-${category}`} className="whitespace-nowrap">
                              {result[category]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Button 
                  onClick={importSelectedContacts}
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                  disabled={selectedNewContacts.length === 0}
                >
                  Import Selected Contacts ({selectedNewContacts.length})
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}