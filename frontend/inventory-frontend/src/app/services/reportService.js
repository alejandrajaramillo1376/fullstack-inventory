import cron from 'node-cron';
import InventoryItem from '../models/InventoryItem.js';
import { createObjectCsvWriter } from 'csv-writer';
import nodemailer from 'nodemailer';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const reportsDir = './reports';
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir);
  console.log('[INIT] Carpeta reports creada');
}

cron.schedule('*/1 * * * *', async () => { // cada 1 minuto (solo para probar)
  console.log('[CRON] Generando reporte de inventario...');
  try {
    const items = await InventoryItem.find().lean();

    const csvWriter = createObjectCsvWriter({
      path: `${reportsDir}/inventory-${new Date().toISOString().slice(0, 10)}.csv`,
      header: [
        { id: 'sku', title: 'SKU' },
        { id: 'name', title: 'NAME' },
        { id: 'quantity', title: 'QUANTITY' }
      ]
    });

    await csvWriter.writeRecords(items);
    console.log('[CRON] CSV generado correctamente');

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: 'manager@example.com',
      subject: 'Reporte diario de inventario',
      text: 'Adjunto el reporte generado automáticamente.',
      attachments: [
        { path: `${reportsDir}/inventory-${new Date().toISOString().slice(0, 10)}.csv` }
      ]
    });

    console.log('[CRON] Reporte enviado correctamente ✅');
  } catch (err) {
    console.error('[CRON] Error generando o enviando el reporte:', err);
  }
});