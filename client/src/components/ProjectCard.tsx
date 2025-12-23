import { Project } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { 
  Bot, 
  Workflow, 
  FileCode, 
  Zap, 
  MoreVertical, 
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  Lightbulb,
  Star
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUpdateProject, useDeleteProject } from "@/hooks/use-projects";
import { cn } from "@/lib/utils";

const typeIcons = {
  web_scraper: Zap,
  bot: Bot,
  workflow: Workflow,
  script: FileCode,
  other: Lightbulb,
};

const statusColors = {
  idea: "bg-blue-500/10 text-blue-600 border-blue-200",
  in_progress: "bg-amber-500/10 text-amber-600 border-amber-200",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  paused: "bg-gray-500/10 text-gray-600 border-gray-200",
};

const statusIcons = {
  idea: Lightbulb,
  in_progress: PlayCircle,
  completed: CheckCircle2,
  paused: PauseCircle,
};

export function ProjectCard({ project, onEdit }: { project: Project, onEdit: (p: Project) => void }) {
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();
  
  const TypeIcon = typeIcons[project.type as keyof typeof typeIcons] || Lightbulb;
  const StatusIcon = statusIcons[project.status as keyof typeof statusIcons] || Lightbulb;

  return (
    <div className="bg-card rounded-xl border border-border p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
      {/* Top Gradient Line */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity",
        project.status === 'completed' ? "from-emerald-400 to-teal-400" :
        project.status === 'in_progress' ? "from-amber-400 to-orange-400" :
        "from-primary to-accent"
      )} />

      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-foreground/70">
            <TypeIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground leading-tight">{project.name}</h3>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(project.createdAt!), { addSuffix: true })}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2 text-muted-foreground hover:text-foreground">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(project)}>
              Edit Project
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => updateMutation.mutate({ id: project.id, isFavorite: !project.isFavorite })}
            >
              {project.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={() => {
                if(confirm('Are you sure you want to delete this project?')) {
                  deleteMutation.mutate(project.id);
                }
              }}
            >
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-grow">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies?.map((tech) => (
          <Badge key={tech} variant="secondary" className="font-normal text-xs bg-secondary/50 hover:bg-secondary">
            {tech}
          </Badge>
        ))}
        {(!project.technologies || project.technologies.length === 0) && (
          <span className="text-xs text-muted-foreground italic">No stack defined</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
        <Badge variant="outline" className={cn("gap-1.5 pl-1.5 pr-2.5 py-0.5", statusColors[project.status as keyof typeof statusColors])}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span className="capitalize">{project.status.replace('_', ' ')}</span>
        </Badge>

        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0 rounded-full", project.isFavorite ? "text-amber-400" : "text-muted-foreground/30 hover:text-amber-400")}
          onClick={() => updateMutation.mutate({ id: project.id, isFavorite: !project.isFavorite })}
        >
          <Star className={cn("w-5 h-5", project.isFavorite && "fill-current")} />
        </Button>
      </div>
    </div>
  );
}
