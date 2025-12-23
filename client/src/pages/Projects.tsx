import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectForm } from "@/components/ProjectForm";
import { Project } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Projects() {
  const { data: projects, isLoading } = useProjects();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const filteredProjects = projects?.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold">Projects</h2>
          <p className="text-muted-foreground mt-1">Manage and track your automation scripts</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="shadow-lg shadow-primary/25">
          <Plus className="mr-2 h-4 w-4" /> Create New
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search projects..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="idea">Idea</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      ) : filteredProjects && filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onEdit={(p) => setEditingProject(p)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-secondary/20 rounded-xl border border-dashed border-border">
          <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">No projects found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mt-1">
            Try adjusting your search filters or create a new project to get started.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => {
            setSearch("");
            setStatusFilter("all");
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <ProjectForm onClose={() => setIsCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <ProjectForm 
              project={editingProject} 
              onClose={() => setEditingProject(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
