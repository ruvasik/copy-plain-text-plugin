# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-12-XX

### Fixed
- Fixed markdown code block processing bug where placeholders were incorrectly interpreted as italic markers
- Fixed missing Greek letter HTML entities (α, β, γ, δ, ε, π, σ, ω, etc.)

### Verified
- Full UTF-8+ character support verified:
  - Cyrillic (Russian, Ukrainian, etc.)
  - Chinese, Japanese, Korean characters
  - Arabic and Hebrew (RTL scripts)
  - Emoji including complex ZWJ sequences (👨‍👩‍👧‍👦), flags (🇷🇺), and skin tones (👋🏿)
  - Mathematical symbols and Greek letters
  - Combining diacritical marks
  - HTML numeric entities (decimal and hex) for all Unicode code points

## [1.0.0] - Initial Release

### Added
- Copy selected text as plain text, removing Markdown/HTML markup
- Preserve line breaks and indentation
- Support for HTML to plain text conversion
- Support for Markdown to plain text conversion
- Automatic content type detection
- Context menu integration
- Keyboard shortcut (Ctrl+Shift+C / Cmd+Shift+C)
