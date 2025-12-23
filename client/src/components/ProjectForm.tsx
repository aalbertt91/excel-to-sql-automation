import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema, type InsertProject, type Project } from "@shared/schema";
import { z } from "zod";
import { useCreateProject, useUpdateProject } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ProjectFormProps {
  project?: Project;
  onClose: () => void;
}

export function ProjectForm({ project, onClose }: ProjectFormProps) {
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const [techInput, setTechInput] = useState("");

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: project ? {
      name: project.name,
      description: project.description,
      status: project.status,
      type: project.type,
      technologies: project.technologies || [],
      isFavorite: project.isFavorite || false,
    } : {
      name: "",
      description: "",
      status: "idea",
      type: "script",
      technologies: [],
      isFavorite: false,
    },
  });

  const onSubmit = (data: InsertProject) => {
    if (project) {
      updateMutation.mutate({ id: project.id, ...data }, { onSuccess: onClose });
    } else {
      createMutation.mutate(data, { onSuccess: onClose });
    }
  };

  const addTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      const currentTechs = form.getValues("technologies") || [];
      if (!currentTechs.includes(techInput.trim())) {
        form.setValue("technologies", [...currentTechs, techInput.trim()]);
      }
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    const currentTechs = form.getValues("technologies") || [];
    form.setValue("technologies", currentTechs.filter(t => t !== tech));
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Weekly Report Scraper" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="web_scraper">Web Scraper</SelectItem>
                    <SelectItem value="bot">Bot / Assistant</SelectItem>
                    <SelectItem value="workflow">Workflow</SelectItem>
                    <SelectItem value="script">Script</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="idea">Idea</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technologies</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <Input 
                    placeholder="Type and press Enter (e.g. Python, Selenium)" 
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={addTech}
                  />
                  <div className="flex flex-wrap gap-2">
                    {field.value?.map((tech) => (
                      <Badge key={tech} variant="secondary" className="gap-1 pl-2.5 pr-1 py-1">
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTech(tech)}
                          className="hover:bg-destructive/20 hover:text-destructive rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the automation goal..." 
                  className="min-h-[100px] resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : project ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
