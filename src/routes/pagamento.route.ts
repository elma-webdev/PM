import { Router } from 'express';
import { atualizarPagamento, buscarPagamentoPorId, criarPagamento, listarPagamentos } from '../controller/pagamento/pagamento.ts';


const router = Router();

router.post('/pagamentos', criarPagamento);
router.get('/pagamentos', listarPagamentos);
router.get('/pagamentos/:id', buscarPagamentoPorId);
router.patch('/pagamentos/:id', atualizarPagamento);

export default router;