<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): true { return true; }
    public function rules(): array
    {
        return [
            'full_name' => 'sometimes|string|max:100',
            'role' => 'sometimes|string|in:admin,petugas,viewer',
            'is_active' => 'sometimes|boolean',
            'password' => 'sometimes|string',
            'modules' => 'sometimes|array',
            'modules.*' => 'string|in:dashboard,komplain,insiden,bor,waktu_tunggu,users',
        ];
    }
}
