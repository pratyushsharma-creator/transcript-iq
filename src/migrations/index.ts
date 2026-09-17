import * as migration_20260511_000000_companies_text_field from './20260511_000000_companies_text_field';
import * as migration_20260513_000000_add_companies_to_versions from './20260513_000000_add_companies_to_versions';
import * as migration_20260513_010000_add_pc_columns_to_feature_spotlight from './20260513_010000_add_pc_columns_to_feature_spotlight';
import * as migration_20260520_000000_normalize_expert_level from './20260520_000000_normalize_expert_level';
import * as migration_20260526_000000_faq_answer_richtext_to_textarea from './20260526_000000_faq_answer_richtext_to_textarea';
import * as migration_20260527_000000_exchange_select_to_text from './20260527_000000_exchange_select_to_text';
import * as migration_20260617_000000_ev_report_leads from './20260617_000000_ev_report_leads';
import * as migration_20260618_000000_blog_lead_form from './20260618_000000_blog_lead_form';
import * as migration_20260619_000000_blog_lead_form_recipient_cc from './20260619_000000_blog_lead_form_recipient_cc';
import * as migration_20260619_010000_locked_docs_ev_report_leads_rel from './20260619_010000_locked_docs_ev_report_leads_rel';
import * as migration_20260709_000000_expert_profile_fields from './20260709_000000_expert_profile_fields';
import * as migration_20260709_010000_ai_execution_gap_content from './20260709_010000_ai_execution_gap_content';
import * as migration_20260917_104302_reconcile_schema_drift from './20260917_104302_reconcile_schema_drift';

export const migrations = [
  {
    up: migration_20260511_000000_companies_text_field.up,
    down: migration_20260511_000000_companies_text_field.down,
    name: '20260511_000000_companies_text_field',
  },
  {
    up: migration_20260513_000000_add_companies_to_versions.up,
    down: migration_20260513_000000_add_companies_to_versions.down,
    name: '20260513_000000_add_companies_to_versions',
  },
  {
    up: migration_20260513_010000_add_pc_columns_to_feature_spotlight.up,
    down: migration_20260513_010000_add_pc_columns_to_feature_spotlight.down,
    name: '20260513_010000_add_pc_columns_to_feature_spotlight',
  },
  {
    up: migration_20260520_000000_normalize_expert_level.up,
    down: migration_20260520_000000_normalize_expert_level.down,
    name: '20260520_000000_normalize_expert_level',
  },
  {
    up: migration_20260526_000000_faq_answer_richtext_to_textarea.up,
    down: migration_20260526_000000_faq_answer_richtext_to_textarea.down,
    name: '20260526_000000_faq_answer_richtext_to_textarea',
  },
  {
    up: migration_20260527_000000_exchange_select_to_text.up,
    down: migration_20260527_000000_exchange_select_to_text.down,
    name: '20260527_000000_exchange_select_to_text',
  },
  {
    up: migration_20260617_000000_ev_report_leads.up,
    down: migration_20260617_000000_ev_report_leads.down,
    name: '20260617_000000_ev_report_leads',
  },
  {
    up: migration_20260618_000000_blog_lead_form.up,
    down: migration_20260618_000000_blog_lead_form.down,
    name: '20260618_000000_blog_lead_form',
  },
  {
    up: migration_20260619_000000_blog_lead_form_recipient_cc.up,
    down: migration_20260619_000000_blog_lead_form_recipient_cc.down,
    name: '20260619_000000_blog_lead_form_recipient_cc',
  },
  {
    up: migration_20260619_010000_locked_docs_ev_report_leads_rel.up,
    down: migration_20260619_010000_locked_docs_ev_report_leads_rel.down,
    name: '20260619_010000_locked_docs_ev_report_leads_rel',
  },
  {
    up: migration_20260709_000000_expert_profile_fields.up,
    down: migration_20260709_000000_expert_profile_fields.down,
    name: '20260709_000000_expert_profile_fields',
  },
  {
    up: migration_20260709_010000_ai_execution_gap_content.up,
    down: migration_20260709_010000_ai_execution_gap_content.down,
    name: '20260709_010000_ai_execution_gap_content',
  },
  {
    up: migration_20260917_104302_reconcile_schema_drift.up,
    down: migration_20260917_104302_reconcile_schema_drift.down,
    name: '20260917_104302_reconcile_schema_drift'
  },
];
