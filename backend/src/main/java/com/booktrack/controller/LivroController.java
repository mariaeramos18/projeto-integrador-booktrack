package com.booktrack.controller;

import com.booktrack.dto.LivroRequestDTO;
import com.booktrack.dto.LivroResponseDTO;
import com.booktrack.model.Livro;
import com.booktrack.model.LivroStatus;
import com.booktrack.service.LivroService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/livros")
public class LivroController {

    @Autowired
    private LivroService service;

    @GetMapping
    public ResponseEntity<List<LivroResponseDTO>> listar(@RequestParam(required = false) String status) {
        LivroStatus filtro = null;
        if (status != null) {
            filtro = LivroStatus.valueOf(status.toUpperCase()); // "LIDO", "LENDO", "QUERO_LER"
        }
        List<Livro> livros = service.listarTodos(filtro);
        List<LivroResponseDTO> response = livros.stream()
                .map(LivroResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LivroResponseDTO> buscar(@PathVariable Long id) {
        Livro livro = service.buscarPorId(id);
        return ResponseEntity.ok(new LivroResponseDTO(livro));
    }

    @PostMapping
    public ResponseEntity<LivroResponseDTO> criar(@Valid @RequestBody LivroRequestDTO dto) {
        Livro novoLivro = service.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(new LivroResponseDTO(novoLivro));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LivroResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody LivroRequestDTO dto) {
        Livro livroAtualizado = service.atualizar(id, dto);
        return ResponseEntity.ok(new LivroResponseDTO(livroAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}