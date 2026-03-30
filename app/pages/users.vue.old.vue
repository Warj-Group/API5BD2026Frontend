<template>
  <div class="flex flex-col p-6 main-content font-sans bg-warj-bg min-h-screen">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
      <h1 class="text-2xl font-bold text-warj-deep">Gestão de Contas e Usuários</h1>
    </div>

    <UCard
      class="w-full mb-6 relative z-20 border-none shadow-md bg-white"
      :ui="{ body: 'overflow-visible p-6' }"
      style="overflow: visible"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-warj-deep">
          Pesquisar Usuário
        </h2>
      </div>

      <div class="relative">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Digite parte do nome ou e-mail para buscar..."
          size="lg"
          class="w-full mb-2 ring-warj-tech/20 focus:ring-warj-tech"
          :loading="loadingUsers"
          autocomplete="off"
        />

        <div
          v-if="searchQuery && filteredUsers.length > 0"
          class="absolute top-full left-0 z-30 w-full bg-white border border-gray-200 rounded-b-md shadow-2xl max-h-60 overflow-y-auto"
        >
          <ul>
            <li
              v-for="user in filteredUsers"
              :key="user.id"
              class="px-4 py-3 hover:bg-warj-bg cursor-pointer border-b border-gray-100 last:border-0 transition-colors duration-150"
              @click="selectUserToEdit(user)"
            >
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-bold text-warj-deep">
                    {{ user.full_name }}
                  </p>
                  <p class="text-xs text-warj-grey font-medium">
                    {{ user.email }}
                    <span v-if="isAdmin"> • {{ formatCpf(user.cpf) }}</span>
                  </p>
                </div>
                <UBadge
                  :color="user.role === 'admin' ? 'warj-tech' : 'green'"
                  variant="subtle"
                  size="xs"
                >
                  {{ user.role }}
                </UBadge>
              </div>
            </li>
          </ul>
        </div>

        <div
          v-else-if="searchQuery && filteredUsers.length === 0"
          class="absolute z-30 w-full bg-white border border-gray-200 rounded-md shadow-lg p-4 mt-1 text-center text-warj-grey font-medium"
        >
          Nenhum usuário encontrado com "{{ searchQuery }}"
        </div>
      </div>
    </UCard>

    <UCard class="w-full mb-6 relative z-10 border-none shadow-md bg-white" :ui="{ body: 'p-6' }">
      <form class="space-y-8" @submit.prevent="onSubmit">
        <div class="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
          <h2 class="text-xl font-bold text-warj-deep">
            {{ isEditing ? "Editando Usuário" : "Novo Cadastro" }}
          </h2>
          <UButton
            v-if="isEditing"
            icon="i-lucide-plus"
            size="sm"
            color="gray"
            variant="ghost"
            label="Voltar para Novo Cadastro"
            @click="resetForm"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          
          <UFormField name="full_name" :error="errors.full_name">
            <template #label>
              <div class="flex items-center gap-1.5 mb-1 text-warj-deep font-bold text-xs uppercase tracking-wider">
                <UIcon name="i-lucide-user" class="w-4 h-4 text-warj-tech" />
                <span>Nome Completo:</span>
                <span v-if="isAdmin" class="text-red-500">*</span>
              </div>
            </template>
            <UInput
              :model-value="form.full_name"
              placeholder="DIGITE O NOME COMPLETO"
              size="lg"
              class="w-full focus:ring-warj-tech"
              :disabled="!isAdmin"
              :ui="{ base: !isAdmin ? 'opacity-70 cursor-not-allowed bg-gray-50' : '' }"
              @update:model-value="handleNameInput"
              @input="errors.full_name = undefined"
            />
          </UFormField>

          <UFormField v-if="currentUserRole === 'admin'" name="email" :error="errors.email">
            <template #label>
              <div class="flex items-center gap-1.5 mb-1 text-warj-deep font-bold text-xs uppercase tracking-wider">
                <UIcon name="i-lucide-mail" class="w-4 h-4 text-warj-tech" />
                <span>E-mail:</span>
                <span v-if="isAdmin" class="text-red-500">*</span>
              </div>
            </template>
            <UInput
              :model-value="form.email"
              type="email"
              placeholder="user@example.com"
              size="lg"
              class="w-full focus:ring-warj-tech"
              :disabled="!isAdmin"
              :ui="{ base: !isAdmin ? 'opacity-70 cursor-not-allowed bg-gray-50' : '' }"
              @update:model-value="handleEmailInput"
              @input="errors.email = undefined"
            />
          </UFormField>

          <UFormField v-if="isAdmin" name="cpf" :error="errors.cpf">
            <template #label>
              <div class="flex items-center gap-1.5 mb-1 text-warj-deep font-bold text-xs uppercase tracking-wider">
                <UIcon name="i-lucide-file-badge" class="w-4 h-4 text-warj-tech" />
                <span>CPF:</span>
                <span class="text-red-500">*</span>
              </div>
            </template>
            <UInput
              :model-value="form.cpf"
              placeholder="000.000.000-00"
              maxlength="14"
              size="lg"
              class="w-full focus:ring-warj-tech"
              @update:model-value="handleCpfInput"
              @input="errors.cpf = undefined"
            />
          </UFormField>

          <UFormField v-if="isAdmin" name="phone" :error="errors.phone">
            <template #label>
              <div class="flex items-center gap-1.5 mb-1 text-warj-deep font-bold text-xs uppercase tracking-wider">
                <UIcon name="i-lucide-phone" class="w-4 h-4 text-warj-tech" />
                <span>Telefone:</span>
              </div>
            </template>
            <UInput
              :model-value="form.phone"
              placeholder="(00) 00000-0000"
              maxlength="15"
              size="lg"
              class="w-full focus:ring-warj-tech"
              @update:model-value="handlePhoneInput"
              @input="errors.phone = undefined"
            />
          </UFormField>

          <UFormField v-if="isAdmin" name="role" :error="errors.role">
            <template #label>
              <div class="flex items-center gap-1.5 mb-1 text-warj-deep font-bold text-xs uppercase tracking-wider">
                <UIcon name="i-lucide-shield" class="w-4 h-4 text-warj-tech" />
                <span>Perfil de Acesso:</span>
                <span class="text-red-500">*</span>
              </div>
            </template>
            <USelectMenu
              v-model="form.role"
              :options="roles"
              option-attribute="label"
              value-attribute="value"
              placeholder="Selecione o perfil"
              size="lg"
              class="w-full"
              @change="errors.role = undefined"
            />
          </UFormField>

          <div class="flex items-center pt-8 gap-10">
            <UCheckbox
              v-model="form.vip"
              name="vip"
              label="Usuário VIP"
              help="Acesso prioritário"
              color="warj-tech"
              :disabled="!isAdmin"
            />

            <UCheckbox
              v-model="form.is_inactive"
              name="is_inactive"
              label="Desativar Conta"
              help="Bloqueia acesso"
              color="red"
              :disabled="!isEditing"
              :ui="{ label: isEditing ? 'text-red-600 font-bold' : 'text-gray-400 font-medium' }"
            />
          </div>

          <UFormField name="password" :error="errors.password">
            <template #label>
              <div class="flex items-center gap-1.5 mb-1 text-warj-deep font-bold text-xs uppercase tracking-wider">
                <UIcon name="i-lucide-lock" class="w-4 h-4 text-warj-tech" />
                <span>Senha:</span>
                <span v-if="isAdmin" class="text-red-500">*</span>
              </div>
            </template>
            <UInput
              v-model="form.password"
              type="password"
              :placeholder="isEditing ? 'Nova senha (min 8 chars)' : 'Mínimo 8 caracteres'"
              size="lg"
              class="w-full focus:ring-warj-tech"
              @input="errors.password = undefined"
            />
          </UFormField>

          <UFormField name="password_confirm" :error="errors.password_confirm">
            <template #label>
              <div class="flex items-center gap-1.5 mb-1 text-warj-deep font-bold text-xs uppercase tracking-wider">
                <UIcon name="i-lucide-lock-keyhole" class="w-4 h-4 text-warj-tech" />
                <span>Confirmar Senha:</span>
                <span v-if="isAdmin" class="text-red-500">*</span>
              </div>
            </template>
            <UInput
              v-model="form.password_confirm"
              type="password"
              placeholder="Repita a senha"
              size="lg"
              class="w-full focus:ring-warj-tech"
              @input="errors.password_confirm = undefined"
            />
          </UFormField>
        </div>

        <div class="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
          
          <UButton
            v-if="isEditing && isAdmin"
            type="button"
            label="Excluir"
            icon="i-lucide-trash-2"
            :disabled="!isEditing"
            color="red"
            variant="soft"
            class="font-bold px-6"
            @click="handleDeleteClick"
          />

          <UButton
            type="button"
            label="Cancelar"
            variant="ghost"
            color="gray"
            class="font-bold px-6 text-warj-grey hover:bg-gray-100"
            @click="resetForm"
          />

          <UButton
            type="submit"
            :label="isEditing ? 'Atualizar Usuário' : 'Salvar Usuário'"
            :loading="isLoading"
            icon="i-lucide-save"
            size="md"
            class="bg-warj-neon hover:bg-warj-neon/90 text-warj-deep font-black shadow-md px-8 transition-transform active:scale-95"
          />
        </div>
      </form>
    </UCard>

    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <UCard class="w-full max-w-lg shadow-2xl border-none">
        <template #header>
          <div class="flex items-center gap-3">
            <div class="bg-red-100 p-2 rounded-full">
              <UIcon name="i-lucide-alert-triangle" class="w-6 h-6 text-red-600" />
            </div>
            <h3 class="text-xl font-bold text-warj-deep">
              Atenção!
            </h3>
          </div>
        </template>

        <div class="py-2">
          <p class="text-gray-700 text-base">
            Tem certeza que deseja deletar a conta de
            <strong class="text-warj-deep text-lg">{{ form.full_name }}</strong>?
          </p>
          <div class="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
            <p class="text-red-700 font-bold text-sm flex items-center gap-2">
              <UIcon name="i-lucide-info" class="w-4 h-4" />
              Esta ação não poderá ser desfeita!
            </p>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              label="Cancelar"
              color="gray"
              variant="ghost"
              class="font-bold"
              @click="showDeleteModal = false"
            />
            <UButton
              label="Sim, Excluir"
              color="red"
              variant="solid"
              icon="i-lucide-trash-2"
              class="font-bold px-6"
              :loading="isLoading"
              @click="deleteUser"
            />
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useRuntimeConfig, useToast } from "#imports";
import emailjs from "@emailjs/browser";
//import DeleteUserModal from "~/components/DeleteUserModal.vue";

const config = useRuntimeConfig();
const toast = useToast();
const isLoading = ref(false);
const showDeleteModal = ref(false);

// Estado da ROLE do usuário logado
const currentUserRole = ref("");

// Helper para verificar se é Admin
const isAdmin = computed(() => currentUserRole.value === "admin");

// --- LÊ VARIÁVEIS DO NUXT.CONFIG (que lê do .env) ---
const EMAILJS_SERVICE_ID = config.public.emailjsServiceId as string;
const EMAILJS_TEMPLATE_ID = config.public.emailjsTemplateId as string;
const EMAILJS_PUBLIC_KEY = config.public.emailjsPublicKey as string;

// --- TIPAGEM ---
interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string | null;
  cpf: string;
  role: string;
  vip: boolean;
  active: boolean;
  created_at?: string;
}

// Interface para erro da API
interface ApiError {
  data?: {
    detail?: string | { msg: string }[];
  };
  message?: string;
}

// --- ESTADO DE PESQUISA ---
const searchQuery = ref("");
const usersList = ref<User[]>([]);
const loadingUsers = ref(false);
const isEditing = ref(false); 
const editingId = ref<number | null>(null); 

// --- COMPUTED: FILTRAR USUÁRIOS ---
const filteredUsers = computed(() => {
  if (!searchQuery.value) return [];
  const term = searchQuery.value.toUpperCase();
  return usersList.value.filter((u) => {
    const name = u.full_name ? u.full_name.toUpperCase() : "";
    const email = u.email ? u.email.toUpperCase() : "";
    return name.includes(term) || email.includes(term);
  });
});

// Opções de Roles (Perfis)
const roles = ref([
  { label: "Administrador", value: "admin" },
  { label: "Agente", value: "agent" },
  { label: "Visualizador", value: "viewer" },
]);

// Estado do formulário
const form = reactive({
  email: "",
  password: "",
  password_confirm: "",
  full_name: "",
  phone: "",
  cpf: "",
  vip: false,
  is_inactive: false,
  role: undefined as string | undefined,
});

// Estado dos erros
const errors = reactive({
  email: undefined as string | undefined,
  password: undefined as string | undefined,
  password_confirm: undefined as string | undefined,
  full_name: undefined as string | undefined,
  phone: undefined as string | undefined,
  cpf: undefined as string | undefined,
  role: undefined as string | undefined,
});

// --- FUNÇÃO DE ENVIO DE EMAIL (FRONTEND) ---
async function sendWelcomeEmail(userData: {
  name: string;
  email: string;
  password?: string;
}) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn("EmailJS: Chaves não configuradas no .env");
    return;
  }

  if (!userData.email) return;

  const templateParams = {
    to_name: userData.name,
    to_email: userData.email,
    senha: userData.password || "Senha padrão ou definida pelo admin",
    link_plataforma: window.location.origin + "/login",
  };

  try {
    const _response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY,
    );
    console.log("✅ Email enviado com sucesso!");

    toast.add({
      title: "E-mail enviado!",
      description: `Convite enviado para ${userData.email}`,
      color: "green",
      icon: "i-lucide-mail-check",
    });
  } catch (error: unknown) {
    console.error("❌ Falha no EmailJS:", error);
    toast.add({
      title: "Falha no envio de e-mail",
      description: "Usuário criado, mas o e-mail falhou.",
      color: "orange",
    });
  }
}

// --- API: BUSCAR USUÁRIOS ---
async function fetchUsers() {
  loadingUsers.value = true;
  try {
    const data = await $fetch<User[]>(`${config.public.apiBase}/users/`);
    usersList.value = data || [];
  } catch (err) {
    console.error("Erro ao buscar usuários para pesquisa", err);
  } finally {
    loadingUsers.value = false;
  }
}

// --- EXCLUIR ---
async function handleDeleteClick() {
  if (!isEditing.value || !editingId.value) return;
  isLoading.value = true;

  try {
    const userCheck = await $fetch<User>(
      `${config.public.apiBase}/users/${editingId.value}`,
    );
    if (userCheck.active === true) {
      toast.add({
        title: "Exclusão Bloqueada",
        description: "Desative a conta antes de excluir.",
        color: "yellow",
        icon: "i-lucide-alert-triangle",
      });
      return; 
    }
    showDeleteModal.value = true;
  } catch (err) {
    console.error("Erro na verificação", err);
  } finally {
    isLoading.value = false;
  }
}

async function deleteUser() {
  if (!editingId.value) return;
  isLoading.value = true;
  try {
    await $fetch(`${config.public.apiBase}/users/${editingId.value}`, {
      method: "DELETE",
    });

    toast.add({
      title: "Conta Deletada",
      description: "Registro removido com sucesso.",
      color: "green",
      icon: "i-lucide-trash-2",
    });

    showDeleteModal.value = false;
    resetForm();
    fetchUsers();
  } catch (err: unknown) {
    const error = err as ApiError;
    let msg = "Não foi possível excluir a conta.";
    if (error.data?.detail) {
      msg = Array.isArray(error.data.detail) ? error.data.detail[0].msg : (error.data.detail as string);
    }
    toast.add({ title: "Erro", description: msg, color: "red" });
  } finally {
    isLoading.value = false;
  }
}

// --- SELECIONAR E LIMPAR ---
function selectUserToEdit(user: User) {
  isEditing.value = true;
  editingId.value = user.id;

  form.full_name = user.full_name;
  form.email = user.email;
  handleCpfInput(user.cpf);
  if (user.phone) handlePhoneInput(user.phone);

  form.role = user.role;
  form.vip = user.vip;
  form.is_inactive = !user.active;
  form.password = "";
  form.password_confirm = "";

  searchQuery.value = "";
  showDeleteModal.value = false;
}

function resetForm() {
  form.email = "";
  form.password = "";
  form.password_confirm = "";
  form.full_name = "";
  form.phone = "";
  form.cpf = "";
  form.vip = false;
  form.is_inactive = false;
  form.role = undefined;

  isEditing.value = false;
  editingId.value = null;
  searchQuery.value = "";
  showDeleteModal.value = false;

  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = undefined;
  });
}

// --- HANDLERS ---
function handleNameInput(value: string) {
  form.full_name = (value || "").toUpperCase();
  if (form.full_name) errors.full_name = undefined;
}

function handleEmailInput(value: string) {
  form.email = (value || "").toLowerCase();
  if (form.email) errors.email = undefined;
}

function handleCpfInput(value: string) {
  if (!value) { form.cpf = ""; return; }
  let v = value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 0) {
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  form.cpf = v;
  errors.cpf = undefined;
}

function formatCpf(value: string | number | null | undefined) {
  if (!value) return "";
  const strValue = String(value).replace(/\D/g, "");
  return strValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function handlePhoneInput(value: string) {
  if (!value) { form.phone = ""; return; }
  let v = value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 0) {
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");
  }
  form.phone = v;
  errors.phone = undefined; 
}

// --- VALIDAÇÃO ---
function validateForm() {
  let isValid = true;
  Object.keys(errors).forEach((key) => (errors[key as keyof typeof errors] = undefined));

  if (!form.full_name || form.full_name.length < 3) {
    errors.full_name = "O nome deve ter no mínimo 3 caracteres.";
    isValid = false;
  }

  if (currentUserRole.value === "admin") {
    if (!form.email || !form.email.includes("@") || !form.email.includes(".")) {
      errors.email = "Informe um e-mail válido.";
      isValid = false;
    }
    const cpfClean = form.cpf.replace(/\D/g, "");
    if (!cpfClean || cpfClean.length !== 11) {
      errors.cpf = "11 dígitos necessários.";
      isValid = false;
    }
    if (!form.role) {
      errors.role = "Selecione um perfil.";
      isValid = false;
    }
  }

  const phoneClean = form.phone.replace(/\D/g, "");
  if (phoneClean.length > 0 && phoneClean.length < 10) {
    errors.phone = "Use DDD + Número.";
    isValid = false;
  }

  if (!isEditing.value) {
    if (!form.password || form.password.length < 8) {
      errors.password = "Mínimo 8 caracteres.";
      isValid = false;
    }
    if (form.password !== form.password_confirm) {
      errors.password_confirm = "As senhas não conferem.";
      isValid = false;
    }
  } else {
    if (form.password.length > 0) {
      if (form.password.length < 8) {
        errors.password = "Mínimo 8 chars.";
        isValid = false;
      }
      if (form.password !== form.password_confirm) {
        errors.password_confirm = "Senhas não conferem.";
        isValid = false;
      }
    }
  }
  return isValid;
}

// --- SUBMIT ---
async function onSubmit() {
  if (!validateForm()) {
    toast.add({ title: "Atenção", description: "Verifique os campos em vermelho.", color: "red" });
    return;
  }

  isLoading.value = true;
  try {
    const payload: Record<string, unknown> = {
      full_name: form.full_name,
      email: form.email,
      vip: form.vip,
      cpf: form.cpf.replace(/\D/g, ""),
      phone: form.phone.replace(/\D/g, ""),
      role: form.role,
    };
    if (form.password) payload.password = form.password;

    let url = `${config.public.apiBase}/users/`;
    let method: "POST" | "PUT" = "POST";
    let successMsg = "Usuário cadastrado.";
    const isNewUser = !isEditing.value; 

    if (isEditing.value && editingId.value) {
      url = `${config.public.apiBase}/users/${editingId.value}`;
      method = "PUT";
      successMsg = "Dados atualizados.";
      payload.active = !form.is_inactive;
    }

    await $fetch(url, { method: method, body: payload });
    toast.add({ title: "Sucesso!", description: successMsg, color: "green" });

    if (isNewUser) {
      await sendWelcomeEmail({ name: form.full_name, email: form.email, password: form.password });
    }

    resetForm();
    fetchUsers();
  } catch (err: unknown) {
    const error = err as ApiError;
    let msg = "Erro desconhecido";
    if (error.data?.detail) {
      msg = Array.isArray(error.data.detail) ? error.data.detail[0].msg : (error.data.detail as string);
    } else if (error.message) msg = error.message;

    const lowerMsg = msg.toLowerCase();
    if (lowerMsg.includes("cpf")) { errors.cpf = "CPF já cadastrado."; msg = errors.cpf; }
    if (lowerMsg.includes("email")) { errors.email = "E-mail em uso."; msg = errors.email; }
    toast.add({ title: "Erro", description: msg, color: "red" });
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  // Simulando role do admin temporariamente para você testar a interface 
  // Remova isso e use a lógica real com o useTerms quando ligar o backend
  currentUserRole.value = "admin";
  
  // Array vazio para não quebrar a tela de pesquisa
  usersList.value = [];
});
</script>