
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingRating from "@/components/FloatingRating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, PenTool, Lock, Printer, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Certificates = () => {
  const navigate = useNavigate();

  const certificateFeatures = [
    {
      title: "Geração Automática",
      description: "Certificados gerados automaticamente após conclusão do evento",
      icon: FileText,
      color: "bg-gradient-to-br from-blue-800/30 to-blue-800/10"
    },
    {
      title: "Assinaturas Digitais",
      description: "Assinaturas digitais do coordenador e secretaria acadêmica",
      icon: PenTool,
      color: "bg-gradient-to-br from-green-800/30 to-green-800/10"
    },
    {
      title: "Código de Verificação",
      description: "Código único para validação da autenticidade do certificado",
      icon: Lock,
      color: "bg-gradient-to-br from-[#EC0444]/30 to-[#EC0444]/10"
    },
    {
      title: "Opção de Impressão",
      description: "Certificados disponíveis em formato digital para impressão",
      icon: Printer,
      color: "bg-gradient-to-br from-purple-800/30 to-purple-800/10"
    }
  ];

  const myCertificates = [
    {
      code: "CERT-2023-1258",
      event: "Workshop de Design Thinking",
      date: "14/09/2023",
      hours: "8h",
      status: "Disponível",
      statusColor: "bg-green-600"
    },
    {
      code: "CERT-2023-1198",
      event: "Curso de Excel Avançado",
      date: "29/08/2023",
      hours: "12h",
      status: "Disponível",
      statusColor: "bg-green-600"
    },
    {
      code: "CERT-2023-1302",
      event: "Simpósio de Sustentabilidade",
      date: "19/10/2023",
      hours: "20h",
      status: "Pendente",
      statusColor: "bg-yellow-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-foreground mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <nav className="text-sm text-muted-foreground mb-2">
                  Início / Certificados
                </nav>
                <h1 className="text-3xl font-bold text-foreground">
                  Módulo de Certificados
                </h1>
                <p className="text-muted-foreground mt-2">
                  Geração e verificação de certificados para participantes de atividades acadêmicas.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {certificateFeatures.map((feature, index) => (
              <Card key={index} className={`${feature.color} border-border`}>
                <CardHeader className="pb-4">
                  <feature.icon className="h-8 w-8 text-foreground mb-2" />
                  <CardTitle className="text-foreground text-sm">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Meus Certificados</h2>
            <Card className="bg-card border-border">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left text-foreground p-4 font-medium">Código</th>
                        <th className="text-left text-foreground p-4 font-medium">Evento</th>
                        <th className="text-left text-foreground p-4 font-medium">Data</th>
                        <th className="text-left text-foreground p-4 font-medium">Carga Horária</th>
                        <th className="text-left text-foreground p-4 font-medium">Status</th>
                        <th className="text-left text-foreground p-4 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myCertificates.map((cert, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="text-muted-foreground p-4 font-mono">{cert.code}</td>
                          <td className="text-foreground p-4">{cert.event}</td>
                          <td className="text-muted-foreground p-4">{cert.date}</td>
                          <td className="text-muted-foreground p-4">{cert.hours}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs text-white ${cert.statusColor}`}>
                              {cert.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-green-400 hover:text-green-300">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader className="bg-muted">
              <CardTitle className="text-foreground text-center">Modelo de Certificado</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="border-4 border-[#EC0444] p-8 text-center bg-background">
                <h2 className="text-2xl font-bold text-[#EC0444] mb-4">FACULDADE CONNECT</h2>
                <p className="text-muted-foreground mb-6">Certificado de Participação</p>
                
                <div className="mb-6">
                  <p className="text-lg mb-4 text-foreground">Certificamos que</p>
                  <h3 className="text-2xl font-bold text-foreground mb-4">[Nome do Participante]</h3>
                  <p className="text-base text-muted-foreground">
                    participou do evento [Nome do Evento] com carga horária de [X] horas, realizado no período de [data início] a [data fim].
                  </p>
                </div>

                <div className="flex justify-between items-end mt-12">
                  <div className="text-center">
                    <div className="border-t border-border pt-2">
                      <p className="text-sm text-foreground">Coordenação</p>
                      <p className="text-xs text-muted-foreground">[Cidade], [Data de emissão]</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-border pt-2">
                      <p className="text-sm text-foreground">Secretaria Acadêmica</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      <FloatingRating />
    </div>
  );
};

export default Certificates;
