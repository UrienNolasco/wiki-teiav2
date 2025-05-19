"use client";

import { Edit, PlusCircle, Trash2 } from "lucide-react";
import React, { useEffect,useState } from "react";
import { toast } from "react-toastify";

// Importe o serviço de capacitação
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getAllCapacitacao } from "../actions/capacitacao/getallcapacitacao";
import { getAllFormacao } from "../actions/formacao/getallformacao";
import { getAllWorkshop } from "../actions/workshop/getallworkshops";




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

const LibManegement = () => {
  const [data, setData] = useState<DatabaseState>({
    formacoes: [],
    capacitacoes: [],
    workshops: [],
  });

  const [loading, setLoading] = useState<boolean>(true);

  const [newFormacao, setNewFormacao] = useState("");
  const [newCapacitacao, setNewCapacitacao] = useState({
    nome: "",
    formacaoId: "",
    link_video: "",
  });
  const [newWorkshop, setNewWorkshop] = useState({
    nome: "",
    capacitacaoId: "",
    link_video: "",
  });

  const [editingFormacao, setEditingFormacao] = useState<Formacao | null>(
    null
  );
  const [editingCapacitacao, setEditingCapacitacao] =
    useState<Capacitacao | null>(null);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(
    null
  );

  const [activeTab, setActiveTab] = useState<"formacoes" | "capacitacoes" | "workshops">(
    "formacoes"
  );

  // Fetch inicial
  async function fetchData() {
    setLoading(true);
    try {
      const [ rawFormacoes, rawCapacitacoes, rawWorkshops ] = await Promise.all([
          getAllFormacao(),
          getAllCapacitacao(),
          getAllWorkshop(),
      ]);

      // 1) Formações: extraímos só id, nome e o array de IDs de capacitações
      const formacoes: Formacao[] = rawFormacoes.map((f) => ({
        id: f.id,
        nome: f.nome,
        capacitacoes: rawCapacitacoes
          .filter((c) => c.formacaoId === f.id)
          .map((c) => c.id),
      }));

      // 2) Capacitações: ajustamos link_video null → undefined
      const capacitacoes: Capacitacao[] = rawCapacitacoes.map((c) => ({
        id: c.id,
        nome: c.nome,
        formacaoId: c.formacaoId,
        link_video: c.link_video ?? undefined,
      }));

      // 3) Workshops: idem para link_video
      const workshops: Workshop[] = rawWorkshops.map((w) => ({
        id: w.id,
        nome: w.nome,
        capacitacaoId: w.capacitacaoId,
        link_video: w.link_video ?? undefined,
      }));

      setData({ formacoes, capacitacoes, workshops });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Helpers
  const getFormacaoById = (id: string) =>
    data.formacoes.find((f) => f.id === id);
  const getCapacitacaoById = (id: string) =>
    data.capacitacoes.find((c) => c.id === id);

  // Handlers de Formação
  const addFormacao = async () => {
    if (!newFormacao.trim()) {
      toast.error("Preencha o nome da formação");
      return;
    }
    await formacaoService.addFormacao({ nome: newFormacao });
    setNewFormacao("");
    await fetchData();
    toast.success("Formação criada com sucesso!");
  };

  const updateFormacao = async () => {
    if (!editingFormacao) return;
    await formacaoService.updateFormacao({
      id: editingFormacao.id,
      nome: editingFormacao.nome,
    });
    setEditingFormacao(null);
    await fetchData();
    toast.success("Formação atualizada com sucesso!");
  };

  const deleteFormacao = async (id: string) => {
    await formacaoService.deleteFormacao(id);
    await fetchData();
    toast.success("Formação excluída com sucesso!");
  };

  // Handlers de Capacitação
  const addCapacitacao = async () => {
    if (!newCapacitacao.nome.trim() || !newCapacitacao.formacaoId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    await capacitacaoService.addCapacitacao({
      nome: newCapacitacao.nome,
      formacaoId: newCapacitacao.formacaoId,
    });
    setNewCapacitacao({ nome: "", formacaoId: "", link_video: "" });
    await fetchData();
    toast.success("Capacitação criada com sucesso!");
  };

  const updateCapacitacao = async () => {
    if (!editingCapacitacao) return;
    await capacitacaoService.updateCapacitacao({
      id: editingCapacitacao.id,
      nome: editingCapacitacao.nome,
      formacaoId: editingCapacitacao.formacaoId,
    });
    setEditingCapacitacao(null);
    await fetchData();
    toast.success("Capacitação atualizada com sucesso!");
  };

  const deleteCapacitacao = async (id: string) => {
    await capacitacaoService.deleteCapacitacao(id);
    await fetchData();
    toast.success("Capacitação excluída com sucesso!");
  };

  // Handlers de Workshop
  const addWorkshop = async () => {
    if (!newWorkshop.nome.trim() || !newWorkshop.capacitacaoId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    await workshopService.addWorkshop({
      nome: newWorkshop.nome,
      capacitacaoId: newWorkshop.capacitacaoId,
      link_video: newWorkshop.link_video,
    });
    setNewWorkshop({ nome: "", capacitacaoId: "", link_video: "" });
    await fetchData();
    toast.success("Workshop criado com sucesso!");
  };

  const updateWorkshop = async () => {
    if (!editingWorkshop) return;
    await workshopService.updateWorkshop({
      id: editingWorkshop.id,
      nome: editingWorkshop.nome,
      capacitacaoId: editingWorkshop.capacitacaoId,
      link_video: editingWorkshop.link_video,
    });
    setEditingWorkshop(null);
    await fetchData();
    toast.success("Workshop atualizado com sucesso!");
  };

  const deleteWorkshop = async (id: string) => {
    await workshopService.deleteWorkshop(id);
    await fetchData();
    toast.success("Workshop excluído com sucesso!");
  };

  if (loading) {
    return <div className="p-8">Carregando dados...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Gerenciamento da Biblioteca de Conteúdos
          </h1>
          <p className="text-muted-foreground">
            Crie, edite e organize formações, capacitações e workshops
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="formacoes">Formações</TabsTrigger>
          <TabsTrigger value="capacitacoes">Capacitações</TabsTrigger>
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
        </TabsList>

        {/* === FORMAÇÕES === */}
        <TabsContent value="formacoes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Formações</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Nova Formação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Formação</DialogTitle>
                  <DialogDescription>
                    Crie uma nova formação
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nome-formacao">Nome</Label>
                    <Input
                      id="nome-formacao"
                      placeholder="Ex: Formação ABAP"
                      value={newFormacao}
                      onChange={(e) => setNewFormacao(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setNewFormacao("")}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={addFormacao}>Adicionar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.formacoes.map((f) => (
              <Card key={f.id} className="shadow-md">
                <CardHeader>
                  <CardTitle>{f.nome}</CardTitle>
                  <CardDescription>
                    {f.capacitacoes.length} capacitações
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
                            value={editingFormacao?.nome || ""}
                            onChange={(e) =>
                              setEditingFormacao((prev) =>
                                prev
                                  ? { ...prev, nome: e.target.value }
                                  : prev
                              )
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setEditingFormacao(null)}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={updateFormacao}>
                          Salvar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteFormacao(f.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* === CAPACITAÇÕES === */}
        <TabsContent value="capacitacoes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Capacitações</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Nova Capacitação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Capacitação</DialogTitle>
                  <DialogDescription>
                    Vincule a uma formação
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nome-capacitacao">Nome</Label>
                    <Input
                      id="nome-capacitacao"
                      placeholder="Ex: Capacitação Básica"
                      value={newCapacitacao.nome}
                      onChange={(e) =>
                        setNewCapacitacao((prev) => ({
                          ...prev,
                          nome: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="formacao">Formação</Label>
                    <Select
                      value={newCapacitacao.formacaoId}
                      onValueChange={(v) =>
                        setNewCapacitacao((prev) => ({
                          ...prev,
                          formacaoId: v,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma formação" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.formacoes.map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="link-video">Link do vídeo</Label>
                    <Input
                      id="link-video"
                      placeholder="Opcional"
                      value={newCapacitacao.link_video}
                      onChange={(e) =>
                        setNewCapacitacao((prev) => ({
                          ...prev,
                          link_video: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setNewCapacitacao({ nome: "", formacaoId: "", link_video: "" })
                    }
                  >
                    Cancelar
                  </Button>
                  <Button onClick={addCapacitacao}>Adicionar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.capacitacoes.map((c) => {
              const f = getFormacaoById(c.formacaoId);
              const countW = data.workshops.filter(
                (w) => w.capacitacaoId === c.id
              ).length;
              return (
                <Card key={c.id} className="shadow-md">
                  <CardHeader>
                    <CardTitle>{c.nome}</CardTitle>
                    <CardDescription>
                      {f?.nome || "—"} ({countW} workshops)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {c.link_video && (
                      <p className="text-sm truncate">{c.link_video}</p>
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
                              value={editingCapacitacao?.nome || ""}
                              onChange={(e) =>
                                setEditingCapacitacao((prev) =>
                                  prev
                                    ? { ...prev, nome: e.target.value }
                                    : prev
                                )
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-formacao">Formação</Label>
                            <Select
                              value={editingCapacitacao?.formacaoId}
                              onValueChange={(v) =>
                                setEditingCapacitacao((prev) =>
                                  prev
                                    ? { ...prev, formacaoId: v }
                                    : prev
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                {data.formacoes.map((f2) => (
                                  <SelectItem key={f2.id} value={f2.id}>
                                    {f2.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-link-video">Link vídeo</Label>
                            <Input
                              id="edit-link-video"
                              value={editingCapacitacao?.link_video || ""}
                              onChange={(e) =>
                                setEditingCapacitacao((prev) =>
                                  prev
                                    ? { ...prev, link_video: e.target.value }
                                    : prev
                                )
                              }
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setEditingCapacitacao(null)}
                          >
                            Cancelar
                          </Button>
                          <Button onClick={updateCapacitacao}>
                            Salvar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteCapacitacao(c.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* === WORKSHOPS === */}
        <TabsContent value="workshops" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Workshops</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Novo Workshop
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Workshop</DialogTitle>
                  <DialogDescription>
                    Vincule a uma capacitação
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nome-workshop">Nome</Label>
                    <Input
                      id="nome-workshop"
                      placeholder="Ex: Workshop Introdutório"
                      value={newWorkshop.nome}
                      onChange={(e) =>
                        setNewWorkshop((prev) => ({
                          ...prev,
                          nome: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="capacitacao">Capacitação</Label>
                    <Select
                      value={newWorkshop.capacitacaoId}
                      onValueChange={(v) =>
                        setNewWorkshop((prev) => ({
                          ...prev,
                          capacitacaoId: v,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma capacitação" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.capacitacoes.map((c2) => (
                          <SelectItem key={c2.id} value={c2.id}>
                            {c2.nome} (
                            {getFormacaoById(c2.formacaoId)?.nome || "—"})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="link-video-workshop">Link do vídeo</Label>
                    <Input
                      id="link-video-workshop"
                      placeholder="Opcional"
                      value={newWorkshop.link_video}
                      onChange={(e) =>
                        setNewWorkshop((prev) => ({
                          ...prev,
                          link_video: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setNewWorkshop({ nome: "", capacitacaoId: "", link_video: "" })
                    }
                  >
                    Cancelar
                  </Button>
                  <Button onClick={addWorkshop}>Adicionar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.workshops.map((w) => {
              const c = getCapacitacaoById(w.capacitacaoId);
              const f = c ? getFormacaoById(c.formacaoId) : null;
              return (
                <Card key={w.id} className="shadow-md">
                  <CardHeader>
                    <CardTitle>{w.nome}</CardTitle>
                    <CardDescription>
                      {c?.nome || "—"} — {f?.nome || "—"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {w.link_video && (
                      <p className="text-sm truncate">{w.link_video}</p>
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
                              value={editingWorkshop?.nome || ""}
                              onChange={(e) =>
                                setEditingWorkshop((prev) =>
                                  prev
                                    ? { ...prev, nome: e.target.value }
                                    : prev
                                )
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-capacitacao">
                              Capacitação
                            </Label>
                            <Select
                              value={editingWorkshop?.capacitacaoId}
                              onValueChange={(v) =>
                                setEditingWorkshop((prev) =>
                                  prev
                                    ? { ...prev, capacitacaoId: v }
                                    : prev
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                {data.capacitacoes.map((c3) => (
                                  <SelectItem key={c3.id} value={c3.id}>
                                    {c3.nome} (
                                    {getFormacaoById(c3.formacaoId)?.nome ||
                                      "—"}
                                    )
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-link-video-workshop">
                              Link vídeo
                            </Label>
                            <Input
                              id="edit-link-video-workshop"
                              value={editingWorkshop?.link_video || ""}
                              onChange={(e) =>
                                setEditingWorkshop((prev) =>
                                  prev
                                    ? { ...prev, link_video: e.target.value }
                                    : prev
                                )
                              }
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setEditingWorkshop(null)}
                          >
                            Cancelar
                          </Button>
                          <Button onClick={updateWorkshop}>
                            Salvar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteWorkshop(w.id)}
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

export default LibManegement;