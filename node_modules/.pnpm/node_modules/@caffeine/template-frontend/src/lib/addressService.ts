// Firebase disabled temporarily — address service stubs
import type { Address } from "@/types";

export async function getUserAddresses(_userId: string): Promise<Address[]> {
  return [];
}

export async function saveAddress(
  _userId: string,
  _address: Omit<Address, "id">,
): Promise<string> {
  return `mock-address-${Date.now()}`;
}

export async function updateAddress(
  _userId: string,
  _addressId: string,
  _data: Partial<Omit<Address, "id">>,
): Promise<void> {
  return Promise.resolve();
}

export async function deleteAddress(
  _userId: string,
  _addressId: string,
): Promise<void> {
  return Promise.resolve();
}
