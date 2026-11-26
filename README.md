# Disk Menezes

Comecei este projeto para organizar as vendas e entregas de um disk cerveja em Biquinhas, MG. O cliente recebe pedidos por telefone, WhatsApp e balcão. A ideia é anotar o que sai, acompanhar as entregas e fechar o dia no mesmo sistema.

Este repositório registra a evolução de um **protótipo**. O painel para PC é a base do projeto. A versão mobile funciona no navegador. O APK para Android fica para uma próxima etapa.

## Versões

- **v0.1.0** · Montei o primeiro painel para computador, com fila de pedidos, estoque, entregas, histórico e fechamento.
- **v0.2.0** · Aprimorei o fluxo de pedidos e a leitura da fila. Os cards passaram a mostrar produtos e quantidades, e os canais e a ordem do catálogo ficaram mais fáceis de usar.
- **v0.3.0** · Adaptei a navegação para celular. A fila mostra uma etapa por vez e a engrenagem reúne os modos de trabalho e as ferramentas.
- **v0.4.0** · Adicionei login por e-mail, recuperação de senha e uma base compartilhada para acessar pelo computador e celular.

## Teste de quatro colunas

Testei uma quarta coluna na branch `experiment/fila-quatro-colunas`. Mantive três colunas na versão principal, com os itens dos pedidos visíveis nos cards.

## Como testar

Para experimentar o layout sem configurar serviços, volte à versão `v0.3.0` e abra `public/index.html` no navegador.

Esta versão roda com Cloudflare Workers, D1 e Supabase. Para hospedar sua própria cópia, preencha o ID do **seu banco de teste** no `wrangler.toml`, aplique as migrações em `migrations/` e configure os secrets `SUPABASE_URL`, `SUPABASE_KEY` e `DISK_ALLOWED_EMAILS` no Worker. O último contém os e-mails autorizados, separados por vírgula.

Na recuperação de senha, o Supabase precisa enviar um código. No modelo **Reset password**, inclua `{{ .Token }}` no corpo do e-mail e autorize o endereço `/redefinir` do seu site nas URLs de redirecionamento. Para enviar a quem está fora da equipe do Supabase, configure um remetente SMTP.

Os comentários no código indicam onde mexer na fila, nos dados de demonstração e no login.

## Como eu testo mudanças

Faço os testes no protótipo online. Uma mudança aprovada fica na branch dela, com um commit que explica o que mudou. Uso `feat/` para recursos novos, `fix/` para correções e `experiment/` para alternativas em avaliação.

## Próxima etapa

Quero testar mais o fluxo de entrega no celular antes de empacotar a versão Android em APK.

Lucas Oliveira · [@lucaspfvr](https://github.com/lucaspfvr)
