import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/ProjectCard";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Activity, 
  CheckCircle2, 
  Lightbulb,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectForm } from "@/components/ProjectForm";
import { Project } from "@shared/schema";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: projects, isLoading } = useProjects();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const projectList = projects || [];
  
  // Stats
  const completed = projectList.filter(p => p.status === 'completed').length;
  const inProgress = projectList.filter(p => p.status === 'in_progress').length;
  const ideas = projectList.filter(p => p.status === 'idea').length;
  
  // Recent projects (last 3)
  const recentProjects = [...projectList]
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, 3);

  // Chart Data
  const typeData = [
    { name: 'Scrapers', value: projectList.filter(p => p.type === 'web_scraper').length },
    { name: 'Bots', value: projectList.filter(p => p.type === 'bot').length },
    { name: 'Workflows', value: projectList.filter(p => p.type === 'workflow').length },
    { name: 'Scripts', value: projectList.filter(p => p.type === 'script').length },
  ].filter(d => d.value > 0);

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Overview of your automation portfolio</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Active Projects" 
          value={inProgress} 
          icon={Activity} 
          color="text-primary"
          bg="bg-primary/10"
        />
        <StatCard 
          title="Completed" 
          value={completed} 
          icon={CheckCircle2} 
          color="text-emerald-500"
          bg="bg-emerald-500/10"
        />
        <StatCard 
          title="Backlog Ideas" 
          value={ideas} 
          icon={Lightbulb} 
          color="text-amber-500"
          bg="bg-amber-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold mb-6">Project Types Distribution</h3>
          <div className="h-[300px] w-full">
            {typeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    width={100}
                    className="text-sm font-medium"
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No data available yet
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed / Empty State */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3 flex-1">
             <div className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors border border-border/50 cursor-pointer group">
                <h4 className="font-medium text-sm">Create Web Scraper</h4>
                <p className="text-xs text-muted-foreground mt-1 group-hover:text-primary transition-colors">Start a new Python/Selenium project</p>
             </div>
             <div className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors border border-border/50 cursor-pointer group">
                <h4 className="font-medium text-sm">Draft Workflow</h4>
                <p className="text-xs text-muted-foreground mt-1 group-hover:text-primary transition-colors">Plan an automation sequence</p>
             </div>
          </div>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Recent Projects</h3>
          <Link href="/projects" className="text-sm font-medium text-primary hover:underline flex items-center">
            View All <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        
        {recentProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onEdit={(p) => setEditingProject(p)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-secondary/20 rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground">No projects yet. Create your first one!</p>
            <Button variant="outline" className="mt-4" onClick={() => setIsCreateOpen(true)}>
              Start Project
            </Button>
          </div>
        )}
      </div>

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

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bg} ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <h4 className="text-2xl font-bold mt-1">{value}</h4>
      </div>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
      </div>
      <Skeleton className="h-[400px] rounded-xl" />
    </div>
  );
}
