import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/ProjectCard";
import { Star } from "lucide-react";
import { Project } from "@shared/schema";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectForm } from "@/components/ProjectForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Favorites() {
  const { data: projects, isLoading } = useProjects();
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const favoriteProjects = projects?.filter(p => p.isFavorite);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
          <Star className="w-6 h-6 fill-current" />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold">Favorites</h2>
          <p className="text-muted-foreground mt-1">Your starred projects for quick access</p>
        </div>
      </div>

      {favoriteProjects && favoriteProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onEdit={(p) => setEditingProject(p)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-secondary/20 rounded-xl border border-dashed border-border">
          <Star className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-semibold text-lg">No favorites yet</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mt-1 mb-6">
            Star projects to see them here for quick access.
          </p>
          <Link href="/projects">
            <Button>Browse Projects</Button>
          </Link>
        </div>
      )}

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
