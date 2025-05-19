"use client";

import { Edit,PlusCircle, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const initialData = {
  formacoes: [
    { id: '1', nome: 'Formação ABAP', capacitacoes: ['1', '2'] },
    { id: '2', nome: 'Formação SD', capacitacoes: ['3'] },
    { id: '3', nome: 'Formação MM', capacitacoes: ['4'] }
  ],
  capacitacoes: [
    { id: '1', nome: 'Capacitação Básica ABAP', formacaoId: '1', link_video: 'https://example.com/video1' },
    { id: '2', nome: 'Capacitação Avançada ABAP', formacaoId: '1', link_video: 'https://example.com/video2' },
    { id: '3', nome: 'Capacitação SD', formacaoId: '2', link_video: 'https://example.com/video3' },
    { id: '4', nome: 'Capacitação MM', formacaoId: '3', link_video: 'https://example.com/video4' }
  ],
  workshops: [
    { id: '1', nome: 'Workshop 1', capacitacaoId: '1', link_video: 'https://example.com/workshop1' },
    { id: '2', nome: 'Workshop 2', capacitacaoId: '1', link_video: 'https://example.com/workshop2' },
    { id: '3', nome: 'Workshop 3', capacitacaoId: '2', link_video: 'https://example.com/workshop3' },
    { id: '4', nome: 'Workshop 4', capacitacaoId: '3', link_video: 'https://example.com/workshop4' },
    { id: '5', nome: 'Workshop 5', capacitacaoId: '4', link_video: 'https://example.com/workshop5' }
  ]
};

// Type definitions
interface Formacao {
  id: string;
  nome: string;
  capacitacoes: string[];
}

interface Capacitacao {
  id: string;
  nome: string;
  formacaoId: string;
  link_video?: string;
}

interface Workshop {
  id: string;
  nome: string;
  capacitacaoId: string;
  link_video?: string;
}

type DatabaseState = {
  formacoes: Formacao[];
  capacitacoes: Capacitacao[];
  workshops: Workshop[];
};

const BibliotecaCRUD = () => {
  const [data, setData] = useState<DatabaseState>(initialData);
  const [newFormacao, setNewFormacao] = useState('');
  const [newCapacitacao, setNewCapacitacao] = useState({ nome: '', formacaoId: '', link_video: '' });
  const [newWorkshop, setNewWorkshop] = useState({ nome: '', capacitacaoId: '', link_video: '' });
  const [editingFormacao, setEditingFormacao] = useState<Formacao | null>(null);
  const [editingCapacitacao, setEditingCapacitacao] = useState<Capacitacao | null>(null);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [activeTab, setActiveTab] = useState('formacoes');

  // Form handlers
  const addFormacao = () => {

    toast.success('Formação criada com sucesso!');
  };

  const updateFormacao = () => {
    if (!editingFormacao) return;
    

    setEditingFormacao(null);
    toast.success('Formação atualizada com sucesso!');
  };

  const deleteFormacao = () => {

    toast.success('Formação excluída com sucesso!');
  };

  const addCapacitacao = () => {

    toast.success('Capacitação criada com sucesso!');
  };

  const updateCapacitacao = () => {
    if (!editingCapacitacao) return;
    
    toast.success('Capacitação atualizada com sucesso!');
  };

  const deleteCapacitacao = () => {
  
    toast.success('Capacitação excluída com sucesso!');
  };

  const addWorkshop = () => {
    if (newWorkshop.nome.trim() === '' || !newWorkshop.capacitacaoId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    toast.success('Workshop criado com sucesso!');
  };

  const updateWorkshop = () => {
    if (!editingWorkshop) return;
    
    toast.success('Workshop atualizado com sucesso!');
  };

  const deleteWorkshop = () => {

    toast.success('Workshop excluído com sucesso!');
  };

  // Helper functions
  const getFormacaoById = (id: string) => {
    return data.formacoes.find(f => f.id === id);
  };

  const getCapacitacaoById = (id: string) => {
    return data.capacitacoes.find(c => c.id === id);
  };

  return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento da Biblioteca de Conteúdos</h1>
            <p className="text-muted-foreground">Crie, edite e organize formações, capacitações e workshops</p>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="formacoes">Formações</TabsTrigger>
            <TabsTrigger value="capacitacoes">Capacitações</TabsTrigger>
            <TabsTrigger value="workshops">Workshops</TabsTrigger>
          </TabsList>

          {/* Formações Tab */}
          <TabsContent value="formacoes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Lista de Formações</h2>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button><PlusCircle className="mr-2 h-4 w-4" /> Nova Formação</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Formação</DialogTitle>
                    <DialogDescription>
                      Crie uma nova formação para o sistema.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nome-formacao">Nome da Formação</Label>
                      <Input
                        id="nome-formacao"
                        placeholder="Ex: Formação ABAP"
                        value={newFormacao}
                        onChange={(e) => setNewFormacao(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewFormacao('')}>Cancelar</Button>
                    <Button onClick={addFormacao}>Adicionar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.formacoes.map((formacao) => (
                <Card key={formacao.id} className="shadow-md">
                  <CardHeader>
                    <CardTitle>{formacao.nome}</CardTitle>
                    <CardDescription>
                      {formacao.capacitacoes.length} capacitações
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Formação</DialogTitle>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-nome-formacao">Nome</Label>
                            <Input
                              id="edit-nome-formacao"
                              value={editingFormacao?.nome || ''}
                              onChange={(e) => setEditingFormacao(prev => 
                                prev ? {...prev, nome: e.target.value} : null
                              )}
                            />
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingFormacao(null)}>
                            Cancelar
                          </Button>
                          <Button onClick={updateFormacao}>
                            Salvar Alterações
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteFormacao()}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Capacitações Tab */}
          <TabsContent value="capacitacoes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Lista de Capacitações</h2>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button><PlusCircle className="mr-2 h-4 w-4" /> Nova Capacitação</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Capacitação</DialogTitle>
                    <DialogDescription>
                      Crie uma nova capacitação vinculada a uma formação.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nome-capacitacao">Nome da Capacitação</Label>
                      <Input
                        id="nome-capacitacao"
                        placeholder="Ex: Capacitação Básica"
                        value={newCapacitacao.nome}
                        onChange={(e) => setNewCapacitacao({...newCapacitacao, nome: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="formacao">Formação</Label>
                      <Select 
                        value={newCapacitacao.formacaoId} 
                        onValueChange={(value) => setNewCapacitacao({...newCapacitacao, formacaoId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma formação" />
                        </SelectTrigger>
                        <SelectContent>
                          {data.formacoes.map((formacao) => (
                            <SelectItem key={formacao.id} value={formacao.id}>
                              {formacao.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="link-video">Link do Vídeo (opcional)</Label>
                      <Input
                        id="link-video"
                        placeholder="https://example.com/video"
                        value={newCapacitacao.link_video}
                        onChange={(e) => setNewCapacitacao({...newCapacitacao, link_video: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewCapacitacao({ nome: '', formacaoId: '', link_video: '' })}>
                      Cancelar
                    </Button>
                    <Button onClick={addCapacitacao}>Adicionar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.capacitacoes.map((capacitacao) => {
                const formacao = getFormacaoById(capacitacao.formacaoId);
                const workshopsCount = data.workshops.filter(w => w.capacitacaoId === capacitacao.id).length;
                
                return (
                  <Card key={capacitacao.id} className="shadow-md">
                    <CardHeader>
                      <CardTitle>{capacitacao.nome}</CardTitle>
                      <CardDescription>
                        Formação: {formacao?.nome || 'N/A'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        {workshopsCount} workshops vinculados
                      </p>
                      {capacitacao.link_video && (
                        <p className="text-sm mt-2 truncate">
                          Vídeo: {capacitacao.link_video}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Capacitação</DialogTitle>
                          </DialogHeader>
                          
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-nome-capacitacao">Nome</Label>
                              <Input
                                id="edit-nome-capacitacao"
                                value={editingCapacitacao?.nome || ''}
                                onChange={(e) => setEditingCapacitacao(prev => 
                                  prev ? {...prev, nome: e.target.value} : null
                                )}
                              />
                            </div>
                            
                            <div className="grid gap-2">
                              <Label htmlFor="edit-formacao">Formação</Label>
                              <Select 
                                value={editingCapacitacao?.formacaoId}
                                onValueChange={(value) => setEditingCapacitacao(prev => 
                                  prev ? {...prev, formacaoId: value} : null
                                )}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma formação" />
                                </SelectTrigger>
                                <SelectContent>
                                  {data.formacoes.map((formacao) => (
                                    <SelectItem key={formacao.id} value={formacao.id}>
                                      {formacao.nome}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="grid gap-2">
                              <Label htmlFor="edit-link-video">Link do Vídeo (opcional)</Label>
                              <Input
                                id="edit-link-video"
                                value={editingCapacitacao?.link_video || ''}
                                onChange={(e) => setEditingCapacitacao(prev => 
                                  prev ? {...prev, link_video: e.target.value} : null
                                )}
                              />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingCapacitacao(null)}>
                              Cancelar
                            </Button>
                            <Button onClick={updateCapacitacao}>
                              Salvar Alterações
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteCapacitacao()}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Workshops Tab */}
          <TabsContent value="workshops" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Lista de Workshops</h2>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button><PlusCircle className="mr-2 h-4 w-4" /> Novo Workshop</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Workshop</DialogTitle>
                    <DialogDescription>
                      Crie um novo workshop vinculado a uma capacitação.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nome-workshop">Nome do Workshop</Label>
                      <Input
                        id="nome-workshop"
                        placeholder="Ex: Workshop de Introdução"
                        value={newWorkshop.nome}
                        onChange={(e) => setNewWorkshop({...newWorkshop, nome: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="capacitacao">Capacitação</Label>
                      <Select 
                        value={newWorkshop.capacitacaoId} 
                        onValueChange={(value) => setNewWorkshop({...newWorkshop, capacitacaoId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma capacitação" />
                        </SelectTrigger>
                        <SelectContent>
                          {data.capacitacoes.map((capacitacao) => (
                            <SelectItem key={capacitacao.id} value={capacitacao.id}>
                              {capacitacao.nome} ({getFormacaoById(capacitacao.formacaoId)?.nome || 'N/A'})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="link-video-workshop">Link do Vídeo (opcional)</Label>
                      <Input
                        id="link-video-workshop"
                        placeholder="https://example.com/video"
                        value={newWorkshop.link_video}
                        onChange={(e) => setNewWorkshop({...newWorkshop, link_video: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewWorkshop({ nome: '', capacitacaoId: '', link_video: '' })}>
                      Cancelar
                    </Button>
                    <Button onClick={addWorkshop}>Adicionar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.workshops.map((workshop) => {
                const capacitacao = getCapacitacaoById(workshop.capacitacaoId);
                const formacao = capacitacao ? getFormacaoById(capacitacao.formacaoId) : null;
                
                return (
                  <Card key={workshop.id} className="shadow-md">
                    <CardHeader>
                      <CardTitle>{workshop.nome}</CardTitle>
                      <CardDescription>
                        {capacitacao?.nome || 'N/A'} - {formacao?.nome || 'N/A'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {workshop.link_video && (
                        <p className="text-sm truncate">
                          Vídeo: {workshop.link_video}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Workshop</DialogTitle>
                          </DialogHeader>
                          
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-nome-workshop">Nome</Label>
                              <Input
                                id="edit-nome-workshop"
                                value={editingWorkshop?.nome || ''}
                                onChange={(e) => setEditingWorkshop(prev => 
                                  prev ? {...prev, nome: e.target.value} : null
                                )}
                              />
                            </div>
                            
                            <div className="grid gap-2">
                              <Label htmlFor="edit-capacitacao">Capacitação</Label>
                              <Select 
                                value={editingWorkshop?.capacitacaoId}
                                onValueChange={(value) => setEditingWorkshop(prev => 
                                  prev ? {...prev, capacitacaoId: value} : null
                                )}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma capacitação" />
                                </SelectTrigger>
                                <SelectContent>
                                  {data.capacitacoes.map((capacitacao) => (
                                    <SelectItem key={capacitacao.id} value={capacitacao.id}>
                                      {capacitacao.nome} ({getFormacaoById(capacitacao.formacaoId)?.nome || 'N/A'})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="grid gap-2">
                              <Label htmlFor="edit-link-video-workshop">Link do Vídeo (opcional)</Label>
                              <Input
                                id="edit-link-video-workshop"
                                value={editingWorkshop?.link_video || ''}
                                onChange={(e) => setEditingWorkshop(prev => 
                                  prev ? {...prev, link_video: e.target.value} : null
                                )}
                              />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingWorkshop(null)}>
                              Cancelar
                            </Button>
                            <Button onClick={updateWorkshop}>
                              Salvar Alterações
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteWorkshop()}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default BibliotecaCRUD;
