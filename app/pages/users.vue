<template>
  <div class="flex flex-col p-6 main-content font-sans bg-warj-bg h-fit pb-12">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-warj-deep">Gestão de Contas e Usuários</h1>
      <p class="text-sm font-medium text-warj-grey">Administre os acessos e perfis da equipe WARJ.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      
      <div class="lg:col-span-2 order-2 lg:order-1">
        <UCard class="border-none shadow-md bg-white" :ui="{ body: 'p-8' }">
          
          <UForm :state="form" class="space-y-8" @submit="onSubmit">
            <div class="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
              <h2 class="text-xl font-bold text-warj-deep">
                {{ isEditing ? "Editando Usuário" : "Novo Cadastro" }}
              </h2>
              <UButton
                v-if="isEditing"
                type="button"
                icon="i-lucide-plus"
                size="sm"
                color="gray"
                variant="ghost"
                label="Limpar para Novo Cadastro"
                @click="resetForm"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <UFormField name="full_name" :error="errors.full_name">
                <template #label>
                  <div class="flex items-center gap-1.5 mb-1 text-warj-deep font-bold text-[10px] uppercase tracking-widest">
                    <UIcon name="i-lucide-user" class="w-3.5 h-3.5 text-warj-tech" />
                    <span>Nome Completo:</span>
                    <span v-if="isAdmin" class="text-red-500">*</span>
                  </div>
                </template>
                <UInput
                  :model-value="form.full_name"
                  placeholder="DIGITE O NOME COMPLETO"
                  size="lg"
                  class="w-full focus:ring-warj-tech"
                  @update:model-value="handleNameInput"
                />
              </UFormField>

              <UFormField name="email" :error="errors.email">
                <template #label>
                  <div class="flex items-center gap-1.5 mb-1 text-warj-deep font-bold text-[10px] uppercase tracking-widest">
                    <UIcon name="i-lucide-mail" class="w-3.5 h-3.5 text-warj-tech" />
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
                  @update:model-value="handleEmailInput"
                />
              </UFormField>

              <UFormField name="phone" :error="errors.phone">
                <template #label>
                  <div class="flex items-center gap-1.5 mb-1 text-warj-deep font-bold text-[10px] uppercase tracking-widest">
                    <UIcon name="i-lucide-phone" class="w-3.5 h-3.5 text-warj-tech" />
                    <span>Telefone:</span>
                  </div>
                </template>
                <UInput
                  :model-value="form.phone"
                  placeholder="(00) 00000-0000"
                  size="lg"
                  class="w-full focus:ring-warj-tech"
                  @update:model-value="handlePhoneInput"
                />
              </UFormField>

              <UFormField name="cpf" :error="errors.cpf">
                <template #label>
                  <div class="flex items-center gap-1.5 mb-1 text-warj-deep font-bold text-[10px] uppercase tracking-widest">
                    <UIcon name="i-lucide-file-badge" class="w-3.5 h-3.5 text-warj-tech" />
                    <span>CPF:</span>
                  </div>
                </template>
                <UInput
                  :model-value="form.cpf"
                  placeholder="000.000.000-00"
                  size="lg"
                  class="w-full focus:ring-warj-tech"
                  @update:model-value="handleCpfInput"
                />
              </UFormField>

              <UFormField name="role" :error="errors.role">
                <template #label>
                  <div class="flex items-center gap-1.5 mb-1 text-warj-deep font-bold text-[10px] uppercase tracking-widest">
                    <UIcon name="i-lucide-shield" class="w-3.5 h-3.5 text-warj-tech" />
                    <span>Perfil de Acesso:</span>
                  </div>
                </template>
                <USelectMenu
                  v-model="form.role"
                  :options="roles"
                  option-attribute="label"
                  value-attribute="value"
                  size="lg"
                  class="w-full"
                />
              </UFormField>

              <div class="flex items-center gap-6 pt-6">
                <UCheckbox v-model="form.vip" label="Usuário VIP" color="warj-tech" />
                <UCheckbox v-model="form.is_inactive" label="Desativar" color="red" :disabled="!isEditing" />
              </div>

              <UFormField name="password" :error="errors.password">
                <template #label>
                  <div class="flex items-center gap-1.5 mb-1 text-warj-deep font-bold text-[10px] uppercase tracking-widest">
                    <UIcon name="i-lucide-lock" class="w-3.5 h-3.5 text-warj-tech" />
                    <span>Senha:</span>
                  </div>
                </template>
                <UInput v-model="form.password" type="password" placeholder="Mínimo 8 caracteres" size="lg" class="w-full focus:ring-warj-tech" />
              </UFormField>

              <UFormField name="password_confirm" :error="errors.password_confirm">
                <template #label>
                  <div class="flex items-center gap-1.5 mb-1 text-warj-deep font-bold text-[10px] uppercase tracking-widest">
                    <UIcon name="i-lucide-lock-keyhole" class="w-3.5 h-3.5 text-warj-tech" />
                    <span>Confirmar Senha:</span>
                  </div>
                </template>
                <UInput v-model="form.password_confirm" type="password" placeholder="Repita a senha" size="lg" class="w-full focus:ring-warj-tech" />
              </UFormField>
            </div>

            <div class="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
              <UButton v-if="isEditing" type="button" label="Excluir" color="red" variant="soft" @click="handleDeleteClick" />
              <UButton type="button" label="Cancelar" variant="ghost" color="gray" @click="resetForm" />
              <UButton type="submit" :label="isEditing ? 'Atualizar' : 'Salvar'" class="bg-warj-neon text-warj-deep font-black px-10 shadow-md" />
            </div>
          </UForm>
        </UCard>
      </div>

      <div class="lg:col-span-1 order-1 lg:order-2">
        <UCard class="border-none shadow-md bg-white h-fit" :ui="{ body: 'p-6' }">
          <div class="mb-4">
            <h2 class="text-lg font-bold text-warj-deep mb-4">Pesquisar Usuário</h2>
            <UInput v-model="searchQuery" icon="i-lucide-search" placeholder="Nome ou e-mail..." size="lg" class="w-full" />
          </div>

          <p class="text-[10px] font-bold text-warj-grey uppercase tracking-widest mb-3">
            Resultados ({{ filteredUsers.length }})
          </p>

          <div class="max-h-[450px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-200">
            <div
              v-for="user in filteredUsers"
              :key="user.id"
              class="p-4 border border-gray-100 rounded-xl hover:border-warj-tech/40 hover:bg-warj-bg cursor-pointer transition-all group flex flex-col gap-1.5"
              @click="selectUserToEdit(user)"
            >
              <div class="flex justify-between items-center w-full">
                <p class="font-bold text-warj-deep text-sm group-hover:text-warj-tech transition-colors truncate pr-2">
                  {{ user?.full_name || 'Usuário sem nome' }}
                </p>
                <UBadge v-if="user?.vip" color="yellow" variant="subtle" size="xs" class="shrink-0">VIP</UBadge>
              </div>
              
              <div class="flex justify-between items-center w-full mt-1">
                <p class="text-xs text-warj-grey font-medium truncate pr-2">
                  {{ user?.email }}
                </p>
                <span class="text-[10px] font-bold text-warj-tech uppercase shrink-0">
                  {{ user?.role }}
                </span>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <UModal v-model="showDeleteModal">
      <template #content>
        <UCard class="p-4 bg-white m-4 rounded-xl shadow-xl">
          <div class="flex items-center gap-3 mb-4">
            <UIcon name="i-lucide-alert-triangle" class="text-red-600 w-6 h-6" />
            <h3 class="font-bold text-warj-deep">Atenção!</h3>
          </div>
          
          <p class="text-sm">
            Tem certeza que deseja deletar a conta de 
            <strong>{{ form.full_name || 'este usuário' }}</strong>?
          </p>
          
          <div class="flex justify-end gap-3 mt-6">
            <UButton type="button" label="Não, manter" variant="ghost" color="gray" @click="showDeleteModal = false" />
            <UButton type="button" label="Sim, Excluir" color="red" @click="deleteUser" />
          </div>
        </UCard>
      </template>
    </UModal>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useToast } from "#imports"; 
import { MOCK_USERS } from "~/utils/mockData";

interface User {
  id?: number;
  full_name: string;
  email: string;
  phone?: string;
  cpf?: string;
  role: string;
  vip?: boolean;
  active?: boolean;
}

const toast = useToast();
const showDeleteModal = ref(false);
const currentUserRole = ref("admin");
const isAdmin = computed(() => currentUserRole.value === "admin");

const searchQuery = ref("");
const usersList = ref<User[]>([]); 
const isEditing = ref(false); 
const editingId = ref<number | null>(null); 

const roles = [
  { label: "Administrador", value: "admin" }, 
  { label: "Controlador", value: "controlador" }, 
  { label: "Visualizador", value: "visualizador" }
];

const form = reactive({ 
  email: "", password: "", password_confirm: "", full_name: "", 
  phone: "", cpf: "", vip: false, is_inactive: false, role: "visualizador" 
});

const errors = reactive<Record<string, string | undefined>>({ 
  email: undefined, full_name: undefined, cpf: undefined, role: undefined 
});

const filteredUsers = computed(() => {
  if (!searchQuery.value) return usersList.value;
  const term = searchQuery.value.toUpperCase();
  return usersList.value.filter((u: User) => 
    u?.full_name?.toUpperCase().includes(term) || u?.email?.toUpperCase().includes(term)
  );
});

function selectUserToEdit(user: User) {
  if (!user) return;
  isEditing.value = true;
  editingId.value = user.id ?? null;
  form.full_name = user.full_name;
  form.email = user.email;
  form.cpf = user.cpf ?? "";
  form.phone = user.phone ?? "";
  form.role = user.role;
  form.vip = user.vip ?? false;
  form.is_inactive = !(user.active ?? true);
  form.password = "warj123#";
  form.password_confirm = "warj123#";
}

function resetForm() {
  isEditing.value = false;
  editingId.value = null;
  form.full_name = ""; form.email = ""; form.cpf = ""; form.phone = ""; 
  form.vip = false; form.is_inactive = false; form.role = "visualizador";
  form.password = ""; form.password_confirm = "";
}

// Handlers Básicos
function handleNameInput(v: string) { form.full_name = v.toUpperCase(); errors.full_name = undefined; }
function handleEmailInput(v: string) { form.email = v.toLowerCase(); errors.email = undefined; }
function handleCpfInput(v: string) { form.cpf = v.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"); }
function handlePhoneInput(v: string) { form.phone = v; }

async function onSubmit() {
  toast.add({ title: "Sucesso!", description: isEditing.value ? "Dados atualizados." : "Usuário cadastrado.", color: "green" });
  resetForm();
}

function handleDeleteClick() { showDeleteModal.value = true; }
async function deleteUser() { showDeleteModal.value = false; resetForm(); }

onMounted(() => {
  usersList.value = MOCK_USERS as User[];
});
</script>