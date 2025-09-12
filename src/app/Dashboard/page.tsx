'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ModeToggle"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import baseapi from "@/lib/axios"
import { useAuth } from '../context/AuthContext';
import { Input } from "@/components/ui/input"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const DashboardPage = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [groupName, setGroupName] = useState("")

  
  useEffect(() => {
  const fetchGroups = async () => {
    try {
      const response = await baseapi.get("/api/groups/");
      const uniqueGroups = Array.from(
        new Map(response.data.map(group => [group.id, group])).values()
      );
      setGroups(uniqueGroups);
    } catch (error) {
      console.error("Failed to fetch groups", error);
    }
  };

  fetchGroups();
}, []);

  const handleCreateGroup = async () => {
  if (!groupName.trim()) return;

  setLoading(true);
  try {
    const res = await baseapi.post("/api/groups/", { name: groupName });

    setGroups(prev => {
      if (prev.some(group => group.id === res.data.id)) {
        return prev;
      }
      return [...prev, res.data];
    });

    setGroupName("");
  } catch (error) {
    console.error("Error creating group", error);
  } finally {
    setLoading(false);
  }
};



  return (
    <>
      <header>
        <div className="flex justify-between items-center h-16 bg-[#0d0c0f] px-6">
          <h1 className="text-2xl font-semibold text-[#4269D7] px-20"> Groups</h1>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Button className="text-white bg-[#4269D7]" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>


      <main className="px-20 py-4">

        <div className="bg-[#151519] py-3 border border-[#2a2a30] rounded-2xl mb-6 shadow-sm">
        <div className="px-4">
          <Textarea
            placeholder="Search Group here..."
            className="h-10 resize-none text-md bg-[#1a1a1e] border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md p-4 text-white placeholder:text-gray-400"
          />
        </div>
      </div>

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {groups.map((group, index) => (
    <Card
      key={group.id}
      className="bg-[#1f1f23] border border-[#2a2a30] hover:border-[#4269D7] rounded-2xl shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg group"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <CardContent className="p-6 space-y-2">
        <h1 className="text-xl font-semibold text-[#4269D7] group-hover:underline">
          {group.name}
        </h1>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {group.description}
        </p>
        <div className="pt-2">
          <Link href={`/Dashboard/groups/${group.id}`}>
            <Button variant="outline" className="text-[#4269D7] border-[#4269D7] hover:bg-[#4269D7] hover:text-white transition-all">
              Open
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
      </main>

      <div className="fixed bottom-6 right-6 z-50">
        <Drawer>
          <DrawerTrigger asChild>
            <div className="fixed bottom-6 right-6 z-50">
              <Button className="flex items-center gap-2 shadow-lg rounded-full size-16 bg-[#4D75E6] hover:bg-blue-700">
                <Plus size={20} />
              </Button>
            </div>
          </DrawerTrigger>

          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>New Group</DrawerTitle>
              <DrawerDescription>Create a new expense group</DrawerDescription>
            </DrawerHeader>

            <div className="px-4">
              <Input
                placeholder="Group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            <DrawerFooter>
              <Button onClick={handleCreateGroup} disabled={loading}>
                {loading ? "Creating..." : "Create Group"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  )
}

export default DashboardPage
