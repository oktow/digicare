<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
{
    public function authorize(): true { return true; }
    public function rules(): array
    {
        return [
            'username' => 'required|string|max:50',
            'password' => 'required|string',
            'full_name' => 'required|string|max:100',
            'role' => 'sometimes|string|in:admin,petugas,viewer',
            'modules' => 'sometimes|array',
            'modules.*' => 'string|in:dashboard,komplain,insiden,bor,waktu_tunggu,users',
        ];
    }
}
