'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Building2, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface ProjectCardData {
  slug: string;
  title: string;
  industry: string;
  country: string;
  location: string;
  services: string[];
  shortDescription: string;
  featuredImage: string;
}

interface ProjectFilterProps {
  initialProjects: ProjectCardData[];
}

export function ProjectFilter({ initialProjects }: ProjectFilterProps) {
  const [selectedService, setSelectedService] = useState<string>('ALL');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const servicesList = [
    { label: 'All Services', value: 'ALL' },
    { label: 'Industrial Insulation', value: 'industrial-insulation' },
    { label: 'Passive Fire Protection', value: 'passive-fire-protection' },
    { label: 'Scaffolding & Access', value: 'scaffolding' },
  ];

  const industriesList = useMemo(() => {
    const set = new Set<string>();
    initialProjects.forEach((p) => set.add(p.industry));
    return ['ALL', ...Array.from(set)];
  }, [initialProjects]);

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((p) => {
      const matchService =
        selectedService === 'ALL' || p.services.includes(selectedService);
      const matchIndustry =
        selectedIndustry === 'ALL' || p.industry === selectedIndustry;
      const matchQuery =
        searchQuery === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

      return matchService && matchIndustry && matchQuery;
    });
  }, [initialProjects, selectedService, selectedIndustry, searchQuery]);

  return (
    <div>
      {/* Filter Controls Bar */}
      <div className="bg-white border border-steel-200 rounded p-6 mb-10 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Service Tabs */}
          <div className="flex flex-wrap gap-2">
            {servicesList.map((svc) => (
              <button
                key={svc.value}
                onClick={() => setSelectedService(svc.value)}
                className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                  selectedService === svc.value
                    ? 'bg-navy-900 text-gold'
                    : 'bg-steel-100 text-steel-700 hover:bg-steel-200'
                }`}
              >
                {svc.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Search project references..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-3 text-xs rounded border border-steel-300 focus:border-navy-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Industry Filter Pills */}
        <div className="flex items-center space-x-2 pt-2 border-t border-steel-100 overflow-x-auto text-xs">
          <span className="font-semibold text-steel-500 uppercase tracking-wider text-[11px] whitespace-nowrap">
            Industry Sector:
          </span>
          {industriesList.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedIndustry === ind
                  ? 'bg-gold text-navy-950 font-bold'
                  : 'text-steel-600 hover:text-navy-900'
              }`}
            >
              {ind === 'ALL' ? 'All Sectors' : ind}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-steel-500">
        <span>{filteredProjects.length} public project reference{filteredProjects.length === 1 ? '' : 's'}</span>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-white border border-steel-200 rounded p-8">
          <h3 className="text-lg font-bold text-navy-900 mb-2">No public project references match</h3>
          <p className="text-sm text-steel-500 mb-6">
            Adjust the filters or contact ARS EXIM to discuss a comparable scope.
          </p>
          <button
            onClick={() => {
              setSelectedService('ALL');
              setSelectedIndustry('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-navy-900 text-gold text-xs font-bold uppercase tracking-wider rounded"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card key={project.slug} className="flex flex-col h-full overflow-hidden group">
              <div className="relative h-56 w-full overflow-hidden bg-navy-950">
                <img
                  src={project.featuredImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <Badge variant="navy">{project.industry}</Badge>
                </div>
              </div>

              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-xs text-steel-500 mb-2 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span>{project.location}, {project.country}</span>
                  </div>

                  <h3 className="text-lg font-bold text-navy-900 leading-snug mb-3 group-hover:text-gold-600 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs text-steel-600 leading-relaxed line-clamp-3 mb-4">
                    {project.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-steel-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {project.services.map((svc) => (
                      <span
                        key={svc}
                        className="text-[10px] uppercase tracking-wider font-semibold text-steel-500 bg-steel-100 px-2 py-0.5 rounded"
                      >
                        {svc.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-navy-900 group-hover:text-gold transition-colors"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
